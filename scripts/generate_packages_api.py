import os
import json
from pathlib import Path
from copy import deepcopy

try:
    import tomllib
except ImportError:
    import tomli as tomllib

def load_mirror_map(repo_path: str):
    config_path = Path(repo_path) / "config.toml"
    mirrors = {}

    if not config_path.exists():
        return mirrors

    with open(config_path, "rb") as f:
        try:
            config = tomllib.load(f)
        except Exception as e:
            print(f"Error parsing {config_path}: {e}")
            return mirrors

    for mirror in config.get("mirrors", []):
        mirror_id = mirror.get("id")
        urls = mirror.get("urls", [])
        if mirror_id and urls:
            mirrors[mirror_id] = urls

    return mirrors

def resolve_mirror_urls(url: str, mirrors: dict[str, list[str]]):
    if url.startswith("http://") or url.startswith("https://"):
        return [url]

    if url.startswith("mirror://"):
        remainder = url[len("mirror://"):]
        mirror_id, _, relative_path = remainder.partition("/")
        base_urls = mirrors.get(mirror_id, [])
        if base_urls:
            resolved = []
            for base in base_urls:
                if relative_path:
                    resolved.append(base.rstrip("/") + "/" + relative_path.lstrip("/"))
                else:
                    resolved.append(base)
            return resolved

    return [url]

def augment_distfiles(data: dict, mirrors: dict[str, list[str]]):
    next_data = deepcopy(data)
    distfiles = next_data.get("distfiles")
    if isinstance(distfiles, list):
        for distfile in distfiles:
            urls = distfile.get("urls", [])
            if isinstance(urls, list):
                resolved_urls = []
                for url in urls:
                    for resolved_url in resolve_mirror_urls(url, mirrors):
                        if resolved_url not in resolved_urls:
                            resolved_urls.append(resolved_url)
                distfile["resolved_urls"] = resolved_urls
    return next_data

def get_entity_display_name(entity):
    t = entity["type"]
    data = entity["data"]
    if t in data and "display_name" in data[t]:
        return data[t]["display_name"]
    if t in data and "variant_name" in data[t]:
        return data[t]["variant_name"]
    if t in data and "id" in data[t]:
        return data[t]["id"]
    return entity["id"]

def load_data(repo_path: str):
    entities = []
    packages = []
    mirrors = load_mirror_map(repo_path)
    
    entities_dir = Path(repo_path) / "entities"
    if entities_dir.exists():
        for type_dir in entities_dir.iterdir():
            if not type_dir.is_dir() or type_dir.name.startswith("_"):
                continue
            for file_path in type_dir.glob("*.toml"):
                with open(file_path, "rb") as f:
                    try:
                        data = tomllib.load(f)
                        if type_dir.name == "device-variant" and "device_variant" in data:
                            data["device-variant"] = data.pop("device_variant")
                        
                        entities.append({
                          "type": type_dir.name,
                          "id": file_path.stem, 
                          "file_path": str(file_path.relative_to(repo_path)),
                          "data": data
                        })
                    except Exception as e:
                        print(f"Error parsing {file_path}: {e}")

    packages_dir = Path(repo_path) / "packages"
    if packages_dir.exists():
        for cat_dir in packages_dir.iterdir():
            if not cat_dir.is_dir():
                continue
            for pkg_dir in cat_dir.iterdir():
                if not pkg_dir.is_dir():
                    continue
                for file_path in pkg_dir.glob("*.toml"):
                    with open(file_path, "rb") as f:
                        try:
                            data = tomllib.load(f)
                            packages.append({
                              "category": cat_dir.name,
                              "package": pkg_dir.name,
                              "version": file_path.stem,
                              "file_path": str(file_path.relative_to(repo_path)),
                              "data": augment_distfiles(data, mirrors)
                            })
                        except Exception as e:
                            print(f"Error parsing {file_path}: {e}")
                            
    return entities, packages, mirrors

def generate_static_api(repo_path: str, output_dir: str):
    print("Loading data...")
    ENTITIES, PACKAGES, MIRRORS = load_data(repo_path)
    
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    
    print("Generating entities.json...")
    entities_res = []
    for e in ENTITIES:
        name = get_entity_display_name(e)
        eid = e["id"]
        entities_res.append({
            "type": e["type"],
            "id": eid,
            "display_name": name,
            "related": e["data"].get("related", []),
            "file_path": e["file_path"]
        })
        
        ent_dir = out / "entities" / e["type"]
        ent_dir.mkdir(parents=True, exist_ok=True)
        with open(ent_dir / f"{eid}.json", "w", encoding="utf-8") as f:
            json.dump(e, f, ensure_ascii=False)
            
    with open(out / "entities.json", "w", encoding="utf-8") as f:
        json.dump(entities_res, f, ensure_ascii=False)

    print("Generating packages.json...")
    packages_res = []
    for p in PACKAGES:
        meta = p["data"].get("metadata", {})
        desc = meta.get("desc", "")
        packages_res.append({
            "category": p["category"],
            "package": p["package"],
            "version": p["version"],
            "desc": desc,
            "file_path": p["file_path"]
        })
        
        pkg_dir = out / "packages" / p["category"] / p["package"]
        pkg_dir.mkdir(parents=True, exist_ok=True)
        with open(pkg_dir / f"{p['version']}.json", "w", encoding="utf-8") as f:
            json.dump(p, f, ensure_ascii=False)
            
    with open(out / "packages.json", "w", encoding="utf-8") as f:
        json.dump(packages_res, f, ensure_ascii=False)
        
    print("Generating hierarchy.json...")
    relations = {}
    for e in ENTITIES:
        my_ref = f"{e['type']}:{e['id']}"
        for rel in e["data"].get("related", []):
            if rel not in relations:
                relations[rel] = []
            relations[rel].append(my_ref)
            
        if e["type"] == "image-combo":
            atoms = e["data"].get("image-combo", {}).get("package_atoms", [])
            for atom in atoms:
                if my_ref not in relations:
                    relations[my_ref] = []
                relations[my_ref].append(f"package:{atom}")
                
    with open(out / "hierarchy.json", "w", encoding="utf-8") as f:
        json.dump(relations, f, ensure_ascii=False)
        
    print("Done!")

if __name__ == "__main__":
    generate_static_api("news/ruyinews", "static/api")
