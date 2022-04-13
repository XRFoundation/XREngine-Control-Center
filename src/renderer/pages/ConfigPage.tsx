import { AppStatus } from 'models/AppStatus'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import 'react-reflex/styles.css'
import LogsView from 'renderer/components/LogsView'
import PageRoot from 'renderer/components/PageRoot'
import StatusView from 'renderer/components/StatusView'
import SudoPasswordDialog from 'renderer/components/SudoPasswordDialog'
import { DeploymentService, useDeploymentState } from 'renderer/services/DeploymentService'

import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, CircularProgress, IconButton, Stack } from '@mui/material'

const ConfigPage = () => {
  const [showPasswordDialog, setPasswordDialog] = useState(false)
  const deploymentState = useDeploymentState()
  const { isConfiguring, appStatus, clusterStatus, systemStatus } = deploymentState.value

  const { enqueueSnackbar } = useSnackbar()
  const allAppsConfigured = appStatus.every((app) => app.status === AppStatus.Configured)
  const allClusterConfigured = clusterStatus.every((cluster) => cluster.status === AppStatus.Configured)
  const allConfigured = allAppsConfigured && allClusterConfigured

  const onConfigureClicked = () => {
    if (allConfigured) {
      enqueueSnackbar('XREngine already configured successfully', { variant: 'success' })
      return
    }

    setPasswordDialog(true)
  }

  const onPassword = async (password: string) => {
    setPasswordDialog(false)

    if (password) {
      DeploymentService.processConfigurations(password)
    }
  }

  return (
    <PageRoot>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 2, marginBottom: 3 }}>
          <IconButton title="Refresh" color="primary" onClick={DeploymentService.fetchDeploymentStatus}>
            <CachedOutlinedIcon />
          </IconButton>
          <LoadingButton
            variant="contained"
            sx={{ background: 'var(--purplePinkGradient)', ':hover': { opacity: 0.8 } }}
            startIcon={<PowerSettingsNewOutlinedIcon />}
            loading={isConfiguring}
            loadingIndicator={
              <Box sx={{ display: 'flex', color: '#ffffffab' }}>
                <CircularProgress color="inherit" size={24} sx={{ marginRight: 1 }} />
                Configuring
              </Box>
            }
            onClick={onConfigureClicked}
          >
            Configure
          </LoadingButton>
          <Button variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />}>
            Uninstall
          </Button>
        </Stack>
        <ReflexContainer orientation="horizontal">
          <ReflexElement minSize={200} flex={0.7} style={{ overflowX: 'hidden' }}>
            <StatusView title="System" statuses={systemStatus} />

            <StatusView title="Apps" statuses={appStatus} />

            <StatusView title="Cluster" statuses={clusterStatus} />
          </ReflexElement>

          <ReflexSplitter />

          <ReflexElement minSize={200} flex={0.3} style={{ overflow: 'hidden' }}>
            <LogsView />
          </ReflexElement>
        </ReflexContainer>
      </Box>
      {showPasswordDialog && <SudoPasswordDialog onClose={(password) => onPassword(password)} />}
    </PageRoot>
  )
}

export default ConfigPage
