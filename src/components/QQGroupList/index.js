import React from "react";
import { Row, Col, QRCode, Card, Divider } from "antd";
import { translate } from "@docusaurus/Translate";

const QQGroupList = () => {
  const data = [
    {
      title: translate({ id: "QQ1", message: "QQ 1群" }),
      value: 'https://qm.qq.com/q/oAWlZnWV3y',
      qqGroupNumber: '544940413'
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },
    {
      title: ' ',
      value: null,
      qqGroupNumber: null
    },


  ]
  return (
    <Card style={{
      backgroundColor: "#fff",
      borderLeftColor: "#06bcee",
      borderLeftWidth: "4px",
      borderRadius: '1rem',
      borderColor: "#e3e3e3",
      margin: "2rem 0"
    }}
      title={<span style={{ color: '#222', fontWeight: 600 }}>{translate({ id: "您可以扫描二维码，或者点击二维码唤起 QQ 加入群聊", message: "您可以扫描二维码，或者点击二维码唤起 QQ 加入群聊" })}</span>}
    >
      <Row gutter={[16, 16]} align={'top'} justify={'start'}>
        {data.map((data, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index} style={{marginBottom: "1rem"}}>
            <Card
              hoverable
              size={"small"}
              headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#222", background: "#f7f7f9" }}
              title={data.title}
              style={{
                backgroundColor: "#f7f7f9",
                borderWidth: "1px",
                borderColor: "#e3e3e3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                borderRadius: "0.75rem",
                minHeight: "260px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
              onClick={() => {
                if (data.value) {
                  window.open(data.value)
                }
              }}
            >
              {
                data.value ? <QRCode value={data.value} size={112} bgColor="#fff" /> : <div style={{ height: '112px', width: "112px" }}></div>
              }
              <Divider style={{ borderColor: '#e3e3e3', marginTop: "10px", marginBottom: "0" }}></Divider>
              {data.qqGroupNumber ? <p style={{
                margin: "0.5rem 0 0 0",
                width: '100%',
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#222"
              }}>{data.qqGroupNumber}</p> :
                <p style={{
                  height: "0.5rem",
                  width: '100%'
                }}> </p>}
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{textAlign: "center", margin: "1.5rem 0"}}>
        <img src="/img/wechat_account_img.png" alt="Our wechat account" style={{maxWidth: "180px", width: "100%", height: "auto", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"}} />
      </div>
    </Card>
  );
};

export default QQGroupList