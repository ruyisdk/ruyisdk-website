import { Card, Statistic, List, Divider, ConfigProvider } from "antd"
import { SmileOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"
import useDashboardClient from "./DashboardClient"
import RuyiLogo from "../../../static/img/ruyi-logo-720.svg"
import { translate } from "@docusaurus/Translate"
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: '2rem', color: "#e3e3e3" }} />
    <p style={{ color: "#e3e3e3" }}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const StatisticalData = () => {
  const axiosInstance = useDashboardClient()
  const [data, setData] = useState(null);
  useEffect(() => {
    if (axiosInstance) {
      (async () => {
        setData((await axiosInstance.post('/fe/dashboard', {})).data)
      })()
    }
  }, [axiosInstance])

  return (
    <>
      <div style={{ backgroundImage: `url('/img/data_background.jpg')`, backgroundPosition: "center", backgroundSize: "cover", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          {data && <Card style={{ width: "90%", height: '90%', backgroundColor: "rgba(0,0,0,0)", border: "none" }}>
            <h2 style={{ color: "#e3e3e3" }}><RuyiLogo style={{ width: "2%", height: "2%" }}></RuyiLogo> <Divider type="vertical" style={{ borderColor: "#e3e3e3" }}></Divider>{translate({ id: "RuyiSDK 数据总览", message: "RuyiSDK 数据总览" })}</h2>
            <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "2rem", fontWeight: "bold" }}>{translate({ id: "下载数量 Downloads", message: "下载数量 Downloads" })}</span>}
              value={data.downloads.total}
              valueStyle={{ color: "#e3e3e3", fontSize: "3rem" }}
              style={{ marginTop: "10rem" }}
            ></Statistic>
            <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "2rem", fontWeight: "bold" }}>{translate({ id: "安装台数 Installs", message: "安装台数 Installs" })}</span>}
              value={data.installs.total}
              headStyle={{ color: "#e3e3e3" }}
              valueStyle={{ color: "#e3e3e3", fontSize: "3rem" }}
            ></Statistic>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "8rem", height: '50vh' }}>
              <Card title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "最常用指令 Top Commands", message: "最常用指令 Top Commands" })}</span>}
                style={{ width: "90%", height: '20rem', backgroundColor: "rgba(0,0,0,0)", border: "none" }}
                headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#e3e3e3" }}>
                <div className="custom-scroll" style={{ maxHeight: "20rem", overflow: "auto", width: "60%", borderTopLeftRadius: "0.4rem", borderBottomLeftRadius: "0.4rem", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                  <List
                    style={{ width: "100%", borderWidth: "0.5px", borderColor: "grey" }}
                    itemLayout="horizontal"
                    dataSource={Object.entries(data.top_commands)}
                    renderItem={([key, value], idx) => (
                      <div>
                        <List.Item
                          style={{ marginLeft: "1rem" }}>
                          <List.Item.Meta
                            title={<span style={{ color: "#d1d1d1" }}>{idx + 1}.  {key}</span>}
                            description={<span style={{ color: "#0da8fa", marginLeft: "1rem", fontWeight: "bold", fontSize: "1rem" }}>{value.total}</span>}
                          />
                        </List.Item>
                      </div>
                    )}
                  />
                </div>
              </Card>
              <Card title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "最常用包 Top Packages", message: "最常用包 Top Packages" })}</span>}
                style={{ width: "90%", height: '15rem', backgroundColor: "rgba(0,0,0,0)", border: "none" }}
                headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#e3e3e3" }}>
                <div className="custom-scroll" style={{ maxHeight: "20rem", width: "60%", borderTopLeftRadius: "0.4rem", borderBottomLeftRadius: "0.4rem", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                  <List
                    style={{ width: "100%", borderWidth: "0.5px", borderColor: "grey" }}
                    itemLayout="horizontal"
                    dataSource={Object.entries(data.top_packages)}
                    renderItem={([key, value], idx) => (
                      <div>
                        <List.Item
                          style={{ marginLeft: "1rem" }}>
                          <List.Item.Meta
                            title={<span style={{ color: "#d1d1d1" }}>{idx + 1}.  {key}</span>}
                            description={<span style={{ color: "#0da8fa", marginLeft: "1rem", fontWeight: "bold", fontSize: "1rem" }}>{value.total}</span>}
                          />
                        </List.Item>
                      </div>


                    )}
                  />
                </div>
              </Card>
            </div>

          </Card >}
        </ConfigProvider>
      </div >
    </>
  )
}

export default StatisticalData