import { useDeploymentStatusState } from 'renderer/services/DeploymentStatusService'

import StatusView from './StatusView'

const AppStatusView = () => {
  const deploymentStatusState = useDeploymentStatusState()
  const { appStatus } = deploymentStatusState.value

  return <StatusView title="Apps" statuses={appStatus} />
}

export default AppStatusView