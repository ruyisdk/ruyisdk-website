RUYI = ruyi_plugin_rev(1)


def _ruyi_has_i18n():  # -> bool
    if not hasattr(RUYI, "has_feature"):
        return False
    return RUYI.has_feature("i18n-v1")


_has_i18n = _ruyi_has_i18n()

# msgs: dict[str, dict[str, str]]
# this is a simplification (ignores the version marker) but already enough
if _has_i18n:
    _msgs = {}
else:
    _msgs = RUYI.load_toml("messages.toml")


# def msg(msgid: str) -> str
def msg(msgid):
    if _has_i18n:
        return RUYI.i18n.msg(msgid)
    return _msgs[msgid]["en_US"]
