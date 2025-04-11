import { Card, Statistic, List, Divider, ConfigProvider, Tabs, } from "antd"
import { SmileOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "./DashboardClient"
import RuyiLogo from "../../../static/img/ruyi-logo-720.svg"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import { Chart } from '@antv/g2';
import ScrollButton from "./ScrollButton";
// for test only
// const mockData = {
//   downloads: { total: 9961 },
//   installs: { total: 9760 },
//   top_commands: {
//     "youmu sakuya hibiki hoshiro serina ayanami": { total: 46 },
//     youmu: { total: 46 }, sakuya: { total: 16 },
//     hibiki: { total: 16 }, hoshino: { total: 16 },
//     serina: { total: 16 }, ayanami: { total: 31 },
//     hina: { total: 31 }, plana: { total: 31 },
//     ibuki: { total: 11 }, qaq: { total: 11 },
//     q2aq: { total: 11 },
//     q3aq: { total: 11 },
//     q4aq: { total: 11 },
//     q5aq: { total: 11 },
//     q6aq: { total: 11 },
//     q7aq: { total: 11 },
//   },
//   top_packages: { ruyi: { total: 46 }, flang: { total: 16 } },
//   last_updated: new Date().toISOString(),
// };

const CustomizeRenderEmpty = () => (
  <div style={{ textAlign: 'center', height: '20rem' }}>
    <SmileOutlined style={{ fontSize: '2rem', color: "black", marginTop: "1rem" }} />
    <p style={{ color: "black" }}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const TopList = ({ data }) => {
  const containerRef = useRef()
  const barData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ action, total }))
  }, [data])

  useEffect(() => {
    if (barData.length && containerRef.current) {

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true
      });
      chart.coordinate({ transform: [{ type: 'transpose' }] });
      chart
        .interval()
        .data(barData)
        .transform({ type: 'sortX', reverse: true, by: "y" })
        .axis('x', {
          line: false,
          title: false,
          label: false,
          tick: false
        })
        .axis('y', { title: false, line: false, tick: false })
        .encode('x', 'action')
        .encode('y', 'total')
        .scale('x', { padding: 0.6 })
        .style('maxWidth', 200)
        .label({
          text: 'action',
          position: "top-left",
          fill: '#000',
          dy: -22,
          fontWeight: 600
        })
        .label({
          text: 'total',
          position: "left",
          fill: 'black',
          dx: 5,
          fontWeight: 600
        })
        .interaction({
          tooltip: {
            body: false
          }
        })


      chart.render();
    }

  }, [barData])

  return (<>
    <div className="custom-scroll" style={{ height: "85vh", overflow: "auto" }}>
      {barData.length ? <div ref={containerRef} style={{ width: "100%", height: "80vh" }}></div>
        : <div style={{ width: "100%", height: "80vh" }}> <CustomizeRenderEmpty></CustomizeRenderEmpty></div>
      }

    </div>
  </>)

}

const StatisticalData = () => {
  const axiosInstance = useDashboardClient()
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const items = [
    {
      key: '1',
      label: translate({ id: "最常用指令 Top Commands", message: "最常用指令" }),
      children: <TopList data={data?.top_commands || {}}></TopList>,
    },
    {
      key: '2',
      label: translate({ id: "最常用包 Top Packages", message: "最常用包" }),
      children: <TopList data={data?.top_packages || {}} />,
    }
  ];
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
      <div className={styles.container}>

        <ConfigProvider renderEmpty={CustomizeRenderEmpty}>
          <Card style={{ height: '100vh', backgroundColor: "rgba(0,0,0,0)", border: "none" }} className={styles.card}>
            <div>
              <h1 style={{ color: "#e3e3e3", marginTop: "2rem" }}>{translate({ id: "RuyiSDK 数据总览", message: "RuyiSDK 数据总览" })}</h1>

              <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "下载数量 Downloads", message: "组件下载数量" })}</span>}
                value={data?.downloads?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
                valueStyle={{ color: "#e3e3e3", fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem", }}
                style={{ marginTop: "2rem" }}
              ></Statistic>
              <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>{translate({ id: "安装台数 Installs", message: "包管理器安装台数" })}</span>}
                value={data?.installs?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
                headStyle={{ color: "#e3e3e3" }}
                valueStyle={{ color: "#e3e3e3", fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem", }}
              ></Statistic>
            </div>

            {data && <p style={{ marginTop: "4rem", color: "#d1d1d1", fontSize: '0.8rem' }}>{translate({ id: "最后更新时间", message: "数据更新时间" })}: {String(data.last_updated).slice(0, 16).replace("T", " ")}</p>}

          </Card >
          <ScrollButton></ScrollButton>
          <Card style={{ height: '90vh', border: "none", marginRight: "1rem", marginLeft: "1rem" }} className={styles.card}>
            <Tabs defaultActiveKey="1" items={items} style={{ width: "100%", height: "90vh" }} more={{ icon: <EllipsisOutlined />, trigger: 'click' }} />
          </Card>

        </ConfigProvider>

      </div >
    </>
  )
}

export default StatisticalData