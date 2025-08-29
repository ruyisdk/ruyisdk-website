import { translate } from "@docusaurus/Translate";

// Placeholder QR Code Image URL (replace with your actual QR code URL)
const DEFAULT_QR_CODE_IMAGE_URL = "/img/wechat_account_img.png";
const DEFAULT_LINK_URL = "http://weixin.qq.com/r/mp/Rx3t9T3E42CcrXmW90hV";

const WeChatLink = ({
  qrCodeImageUrl = DEFAULT_QR_CODE_IMAGE_URL,
  linkUrl = DEFAULT_LINK_URL,
  titleText = translate({
    message: "RuyiSDK微信公众号",
    id: "wechatlink.title",
    description: "Title for WeChat link section",
  }),
  buttonText = translate({
    message: "点击关注",
    id: "wechatlink.buttonText",
    description: "Button text for WeChat link",
  }),
}) => {
  return (
    <div className="w-full py-6 md:hidden">
      <div className="flex flex-col items-center gap-4 px-4 py-6">
        <h3 className="text-emphasis mb-1 text-center text-xl font-bold">
          {titleText}
        </h3>

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translate({
            message: "Open link by clicking QR code",
            id: "wechatlink.qrAriaLabel",
            description: "Accessibility label for QR code link",
          })}
        >
          <img
            src={qrCodeImageUrl}
            alt={translate({
              message: "QR Code",
              id: "wechatlink.qrAltText",
              description: "Alt text for QR code image",
            })}
            className="block h-[9.375rem] w-[9.375rem] rounded-md shadow"
          />
        </a>

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[9.375rem] rounded-full bg-[#FCE8A4] px-5 py-2.5
            font-semibold shadow transition hover:-translate-y-0.5
            hover:bg-[#F8F3E2] hover:shadow-lg"
        >
          <div className="text-emphasis text-center">{buttonText}</div>
        </a>
      </div>
    </div>
  );
};

export default WeChatLink;
