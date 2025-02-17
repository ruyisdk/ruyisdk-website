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
      backgroundColor: "#282a36",
      borderLeftColor: "grey",
      borderLeftColor: "#06bcee",
      borderLeftWidth: "4px",
      borderRadius: '1rem',
      borderColor: "#282a36",

    }}
      title={<span style={{ color: '#e3e3e3' }}>{translate({ id: "您可以扫描二维码，或者点击二维码唤起 QQ 加入群聊", message: "您可以扫描二维码，或者点击二维码唤起 QQ 加入群聊" })}</span>}
    >
      <Row gutter={[1, 1]} align={'top'} justify={'start'}>
        {data.map((data, index) => (
          <Col xs={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              size={"small"}
              headStyle={{ borderBottom: 'none', fontSize: "1rem", color: "#e3e3e3" }}
              title={data.title}
              style={{
                backgroundColor: "#282a36",
                borderWidth: "0.1rem",
                borderColor: "#e3e3e3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                borderRadius: "0"
              }}
              onClick={() => {
                if (data.value) {
                  window.open(data.value)
                }
              }}
            >
              {
                data.value ? <QRCode value={data.value} size={128} bgColor="#e3e3e3" /> : <div style={{ height: '128px', width: "128px" }}></div>
              }
              <Divider style={{ borderColor: '#e3e3e3', marginTop: "10px", marginBottom: "0" }}></Divider>
              {data.qqGroupNumber ? <p style={{
                height: "0.5rem",
                width: '100%',
                textAlign: "center",
                fontSize: "large",
                fontWeight: "bolder",
                color: "#e3e3e3"
              }}>{data.qqGroupNumber}</p> :
                <p style={{
                  height: "0.5rem",
                  width: '100%'
                }}> </p>}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QQGroupList