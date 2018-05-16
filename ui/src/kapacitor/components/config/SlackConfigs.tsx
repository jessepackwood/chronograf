import React, {PureComponent} from 'react'
import _ from 'lodash'

import {ErrorHandling} from 'src/shared/decorators/errors'
import SlackConfig from 'src/kapacitor/components/config/SlackConfig'

interface Properties {
  channel: string
  url: string
  workspace?: string
}

interface Config {
  options: {
    url: boolean
    channel: string
    workspace: string
  }
}

interface Props {
  slackConfigs: any[]
  config: Config
  onSave: (properties: Properties, isNewConfigInSection: boolean) => void
  onTest: (event: React.MouseEvent<HTMLButtonElement>) => void
  enabled: boolean
}

interface State {
  slackConfigs: any[]
}

@ErrorHandling
class SlackConfigs extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      slackConfigs: this.props.slackConfigs,
    }
  }

  public render() {
    const {slackConfigs} = this.state
    const {onSave, onTest, enabled} = this.props
    const configNums = slackConfigs.length

    return (
      <div>
        {slackConfigs.map(config => {
          const key = _.get(config, ['options', 'workspace'], 'default')
          const configEnabled = _.get(config, ['options', 'enabled'], false)
          const isFirstConfigNew = configNums === 1 && !configEnabled
          const isNewConfig =
            isFirstConfigNew || _.get(config, 'isNewConfig', false)

          return (
            <SlackConfig
              key={key}
              onSave={onSave}
              config={config}
              onTest={onTest}
              enabled={enabled}
              isNewConfig={isNewConfig}
            />
          )
        })}
        <button className="btn btn-md btn-default" onClick={this.addConfig}>
          <span className="icon plus" /> Add Another Config
        </button>
      </div>
    )
  }

  private get slackConfigs() {
    return this.state.slackConfigs
  }

  private addConfig = () => {
    const configs = this.slackConfigs
    const newConfig = {
      options: {
        url: false,
        channel: '',
      },
      isNewConfig: true,
    }
    this.setState({slackConfigs: [...configs, newConfig]})
  }
}

export default SlackConfigs
