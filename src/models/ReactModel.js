export default class ReactModel {
  constructor() {
    this.imports = [
      "const Naptime = require('naptime');",
      "const React = require('react');",
      "require('css!./__styles__/PromoBanner');",
    ];
  }

  template() {
    return `
    type Props = {
      s12nId: string,
      showEnrollModal: () => void,
    }

    class PromoBanner extends React.Component<*, Props, *> {
      render() {
        const { s12nId, showEnrollModal } = this.props;

        return (
          <div
            className="rc-PromoBanner align-horizontal-center"
            style={this.getFreeTrialBackground(bannerData.bannerURL)}
            >
            <div className="color-primary-text">
              <h2 className="headline-5-text banner-title">
                {bannerData.title}
              </h2>
              <p className="body-1-text banner-description">
                {bannerData.description}
              </p>
              <S12nEnrollButton
                className="s12n-enroll comfy banner-button"
                s12nId={s12nId}
                onClick={showEnrollModal}
                needToEnrollText={bannerData.cta}
                data={data}
              />
            </div>
          </div>
        );
      }
    }

    module.exports = PromoBanner;
    `
  }
}
