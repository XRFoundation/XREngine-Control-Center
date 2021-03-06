import { useState } from 'react'
import { SettingsService, useSettingsState } from 'renderer/services/SettingsService'

import { TabContext, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Tab,
  Tabs,
  Typography
} from '@mui/material'

import logo from '../../../assets/icon.svg'
import ConfigConfigsView from './ConfigConfigsView'
import ConfigMinikubeView from './ConfigMinikubeView'
import ConfigVarsView from './ConfigVarsView'

interface Props {
  onClose: () => void
}

const SettingsDialog = ({ onClose }: Props) => {
  const [currentTab, setTab] = useState('1')
  const settingsState = useSettingsState()
  const { appVersion, configs, vars } = settingsState.value
  const [tempConfigs, setTempConfigs] = useState({} as Record<string, string>)
  const [tempVars, setTempVars] = useState({} as Record<string, string>)

  const localConfigs = {} as Record<string, string>
  for (const key in configs.data) {
    localConfigs[key] = key in tempConfigs ? tempConfigs[key] : configs.data[key]
  }

  const localVars = {} as Record<string, string>
  for (const key in vars.data) {
    localVars[key] = key in tempVars ? tempVars[key] : vars.data[key]
  }

  const changeConfig = async (key: string, value: string) => {
    const newConfigs = { ...tempConfigs }
    newConfigs[key] = value
    setTempConfigs(newConfigs)
  }

  const changeVar = async (key: string, value: string) => {
    const newVars = { ...tempVars }
    newVars[key] = value
    setTempVars(newVars)
  }

  const saveSettings = async () => {
    const saved = await SettingsService.saveSettings(tempConfigs, tempVars)
    if (saved) {
      onClose()
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm" scroll="paper">
      {(configs.loading || vars.loading) && <LinearProgress />}
      <DialogTitle>Settings</DialogTitle>
      <DialogContent dividers sx={{ padding: 0 }}>
        <TabContext value={currentTab}>
          <Box sx={{ height: '40vh', display: 'flex' }}>
            <Tabs
              orientation="vertical"
              className="settingTabs"
              value={currentTab}
              onChange={(_event, newValue) => setTab(newValue)}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Configs" value="1" />
              <Tab label="Variables" value="2" />
              <Tab label="Minikube" value="3" />
              <Tab label="About" value="4" />
            </Tabs>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <TabPanel value="1">
                <ConfigConfigsView
                  localConfigs={localConfigs}
                  onChange={changeConfig}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                />
              </TabPanel>
              <TabPanel value="2">
                <ConfigVarsView
                  localVars={localVars}
                  onChange={changeVar}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                />
              </TabPanel>
              <TabPanel value="3">
                <ConfigMinikubeView sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }} />
              </TabPanel>
              <TabPanel value="4">
                <Box>
                  <Box sx={{ display: 'flex', mr: 6, mb: 2, alignItems: 'center', flexDirection: 'row' }}>
                    <Box sx={{ height: 45, mr: 0.7 }} component="img" src={logo} />
                    <Typography variant="h6">Control Center</Typography>
                  </Box>
                  <DialogContentText variant="button">App Version: {appVersion}</DialogContentText>
                </Box>
              </TabPanel>
            </Box>
          </Box>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          disabled={
            configs.loading ||
            vars.loading ||
            (Object.keys(tempConfigs).length === 0 && Object.keys(tempVars).length === 0)
          }
          onClick={saveSettings}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
