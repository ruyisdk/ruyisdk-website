import { Card, Statistic, ConfigProvider, Tabs, } from "antd"
import { SmileOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "./DashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import { Chart } from '@antv/g2';

const CustomizeRenderEmpty = () => (
  <div style={{ textAlign: 'center', height: '20rem' }}>
    <SmileOutlined style={{ fontSize: '2rem', color: "black", marginTop: "1rem" }} />
    <p style={{ color: "black" }}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const TopList = ({ data }) => {
  const containerRef = useRef();
  const chartRef = useRef();
  const scrollContainerRef = useRef();

  const barData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ action, total }));
  }, [data]);

  useEffect(() => {
    if (barData.length && containerRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        events: {
          enabled: false
        }
      });

      chartRef.current = chart;

      chart.coordinate({ transform: [{ type: 'transpose' }] });
      chart
        .interval().style({
          fill: "#0d4977"
        })
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
          fill: 'white',
          dx: 5,
          fontWeight: 600
        })
        .interaction({
          tooltip: {
            body: false
          }
        });
      chart.interaction('view-scroll', false);

      chart.render();
    }
  }, [barData]);

  return (
    <div
      ref={scrollContainerRef}
      className="custom-scroll"
      style={{
        height: "75vh",
        overflow: "auto",
        WebkitOverflowScrolling: "touch"
      }}
    >
      {barData.length ?
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "70vh",
            touchAction: "pan-y",
            position: "relative"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              background: "transparent"
            }}
          />
        </div>
        :
        <div style={{ width: "100%", height: "70vh" }}>
          <CustomizeRenderEmpty />
        </div>
      }
    </div>
  );
};

const StatisticalData = () => {
  const axiosInstance = useDashboardClient()
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const CardOneitems = [
    {
      key: '1',
      label: translate({ id: "最常用指令 Top Commands", message: "最常用指令" }),
      children: <TopList data={data?.top_commands || {}}></TopList>,
    },
  ];

  const CardTwoitems = [
    {
      key: '1',
      label: translate({ id: "最常用包 Top Packages", message: "最常用包" }),
      children: <TopList data={data?.top_packages || {}} />,
    }
  ];

  useEffect(() => {
    if (!axiosInstance) return;

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
  }, [axiosInstance]);

  return (
    <div
      className={styles.container}
    >
      <ConfigProvider
        renderEmpty={CustomizeRenderEmpty}
        theme={{
          components: {
            Tabs: {
              itemSelectedColor: "#0d4977",
              inkBarColor: "#0d4977"
            }
          }
        }}
      >
        <div
          className={styles.card}
        >
          <Card
            style={{
              width: '90%',
              height: '90vh',
              backgroundColor: "rgba(0,0,0,0)",
              border: "none",
              margin: "0 auto"
            }}
          >
            <div>
              <h1 style={{ color: "#e3e3e3", marginTop: "2rem" }}>
                {translate({ id: "RuyiSDK 数据总览", message: "RuyiSDK 数据总览" })}
              </h1>

              <Statistic
                title={
                  <span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {translate({ id: "下载数量 Downloads", message: "组件下载数量" })}
                  </span>
                }
                value={data?.downloads?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
                valueStyle={{
                  color: "#e3e3e3",
                  fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem",
                }}
                style={{ marginTop: "2rem" }}
              />

              <Statistic
                title={
                  <span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {translate({ id: "安装台数 Installs", message: "包管理器安装台数" })}
                  </span>
                }
                value={data?.installs?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
                headStyle={{ color: "#e3e3e3" }}
                valueStyle={{
                  color: "#e3e3e3",
                  fontSize: data?.downloads?.total != null ? "3rem" : "1.5rem",
                }}
              />
            </div>

            {data && (
              <p style={{ marginTop: "4rem", color: "#d1d1d1", fontSize: '0.8rem' }}>
                {translate({ id: "最后更新时间", message: "数据更新时间" })}:
                {String(data.last_updated).slice(0, 16).replace("T", " ")}
              </p>
            )}
          </Card>
        </div>

        <div
          className={styles.card}
        >
          <Card
            style={{
              width: '80%',
              height: '75vh',
              border: "none",
              marginTop: "1rem"
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={CardOneitems}
              style={{ width: "100%", height: "90vh" }}
              more={{ icon: <EllipsisOutlined />, trigger: 'click' }}
            />
          </Card>
        </div>

        <div
          className={styles.card}
        >
          <Card
            style={{
              width: '80%',
              height: '75vh',
              border: "none",
              marginTop: "1rem"
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={CardTwoitems}
              style={{ width: "100%", height: "90vh" }}
              more={{ icon: <EllipsisOutlined />, trigger: 'click' }}
            />
          </Card>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default StatisticalData