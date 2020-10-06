import { Box, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import  React from 'react';
import { FlexboxGrid, Panel } from 'rsuite';
import CreateByKeystore from './CreateByKeystore';
import CreateByMnemonicPhrase from './CreateByMnemonicPhrase';
import CreateByPrivateKey from './CreateByPrivateKey';
import './createWallet.css'

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

class CreateNewWallet extends React.Component {
    
    state = {
        value: 0
    }
    
    handleChange = (event: any, value: any) => {
        this.setState({value})
    }

    render() {
        const {value} = this.state;
        return (
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={10}>
                        <div className="create-wallet-container">
                            <Panel header="Create new wallet" shaded>
                                 <Tabs value={value} onChange={this.handleChange}>
                                    <Tab label="By Private Key"/>
                                    <Tab label="By Keystore File"/>
                                    <Tab label="By Mnemonic Phrase"/>
                                </Tabs>
                                <TabPanel value={value} index={0}>
                                    <CreateByPrivateKey />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <CreateByKeystore />
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <CreateByMnemonicPhrase />
                                </TabPanel>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}


export default CreateNewWallet;