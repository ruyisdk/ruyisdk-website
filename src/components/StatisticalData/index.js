import { Card, Statistic, List, Divider, ConfigProvider } from "antd"
import { SmileOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"
import useDashboardClient from "./DashboardClient"
import RuyiLogo from "../../../static/img/ruyi-logo-720.svg"
import { translate } from "@docusaurus/Translate"

// for test only
const mockData = {
  downloads: { total: 9961 },
  installs: { total: 9760 },
  top_commands: { "youmu sakuya hibiki hoshiro serina ayanami": { total: 46 }, youmu: { total: 46 }, sakuya: { total: 16 }, hibiki: { total: 16 }, hoshino: { total: 16 }, serina: { total: 16 }, ayanami: { total: 31 } },
  top_packages: { ruyi: { total: 46 }, flang: { total: 16 } },
  last_updated: new Date().toISOString(),
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center', height: '20rem'  }}>
    <SmileOutlined style={{ fontSize: '2rem', color: "#e3e3e3", marginTop: "1rem" }} />
    <p style={{ color: "#e3e3e3" }}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const TopList = ({ data }) => (
                  <List
                    style={{ width: "100%", borderWidth: "0.5px", borderColor: "grey" }}
                    itemLayout="horizontal"
                    dataSource={Object.entries(data)}
                    locale={{
                      emptyText: customizeRenderEmpty(),
                    }}
                    renderItem={([key, value], idx) => (
                      <div>
                        <List.Item
                          style={{ marginLeft: "1rem" }}>
                          <List.Item.Meta
                            title={<span style={{ color: "#d1d1d1", fontSize: "1.5rem" }}>{idx + 1}.  {key}</span>}
                            description={<span style={{ color: "#0da8fa", marginLeft: "1rem", fontWeight: "bold", fontSize: "1.5rem" }}>{value.total}</span>}
                          />
                        </List.Item>
                      </div>
                    )}
                  />
)

const StatisticalData = () => {
  const axiosInstance = useDashboardClient()
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!axiosInstance) return;

    // set test data
    // setData(mockData);
    // return;

    let retryTimer = null;
    let retryCount = 0;

    const apiPost = async () => {
        if (retryCount > 5) {
          console.warn('Stop retry')
          return;
        }

        try {
          setData((await axiosInstance.post('/fe/dashboard', {})).data)
          setError(null);
        } catch (error) {
          console.error('Statistical Data API error, will retry', error)
          setError(error);
          retryTimer = setTimeout(apiPost, 2 ** retryCount * 1000);
          retryCount++;
        }
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(apiPost);
      return () => {
        cancelIdleCallback(id);
        clearTimeout(retryTimer);
      }
    } else {
      retryTimer = setTimeout(apiPost, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [axiosInstance])

  return (
    <>
      <div style={{ backgroundImage: `url('/img/data_background.jpg')`, backgroundPosition: "center", backgroundSize: "cover", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}>

        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Card style={{ width: "90%", height: '90%', backgroundColor: "rgba(0,0,0,0)", border: "none" }}>
            <h1 style={{ color: "#e3e3e3", marginTop: "4rem" }}>{translate({ id: "RuyiSDK 数据总览", message: "RuyiSDK 数据总览" })}</h1>

            <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "2rem", fontWeight: "bold" }}>{translate({ id: "下载数量 Downloads", message: "组件下载数量" })}</span>}
              value={data?.downloads?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
              valueStyle={{ color: "#e3e3e3", fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem", }}
              style={{ marginTop: "4rem" }}
            ></Statistic>
            <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "2rem", fontWeight: "bold" }}>{translate({ id: "安装台数 Installs", message: "包管理器安装台数" })}</span>}
              value={data?.installs?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
              headStyle={{ color: "#e3e3e3" }}
              valueStyle={{ color: "#e3e3e3", fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem", }}
            ></Statistic>

            <div style={{ display: "flex", flexDirection: "row", marginTop: "4rem", height: 'auto', flexWrap: 'wrap',  width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>

              <Card title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "最常用指令 Top Commands", message: "最常用指令" })}</span>}
                style={{ flex: 'none', width: "30rem", minWidth: '24rem', maxWidth: '70%', minHeight: '20rem', height: '30rem', backgroundColor: "rgba(0,0,0,0)", border: "none" }}
                headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#e3e3e3", padding: "0" }}
              bodyStyle={{ padding: "16px 0" }}>
                <div className="custom-scroll" style={{ maxHeight: "20rem", minHeight: "20rem", overflow: "auto", width: "80%", borderRadius: "0.4rem", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                  <TopList data={data?.top_commands || {}} />
                </div>
              </Card>

              <Card title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "最常用包 Top Packages", message: "最常用包" })}</span>}
                style={{ flex: 'none', width: "30rem", minWidth: '24rem', maxWidth: '70%', height: '30rem', minHeight: '20rem', backgroundColor: "rgba(0,0,0,0)", border: "none" }}
                headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#e3e3e3", padding: "0" }} bodyStyle={{ padding: "16px 0" }}>
                <div className="custom-scroll" style={{ maxHeight: "20rem", minHeight: "20rem", width: "80%", borderRadius: "0.4rem", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                  <TopList data={data?.top_packages || {}} />
                </div>
              </Card>

            </div>
            {data && <p style={{ marginTop: "4rem", color: "#d1d1d1", fontSize: '0.8rem' }}>{ translate({ id: "最后更新时间", message: "数据更新时间" }) }: {String(data.last_updated).slice(0, 16).replace("T", " ")}</p>}

          </Card >

        </ConfigProvider>

      </div >
    </>
  )
}

export default StatisticalData
