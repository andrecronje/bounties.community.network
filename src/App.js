import React, { Component } from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import ButtonAppBar from './components/ButtonAppBar.js'
import Card, { CardActions, CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText, FormControlLabel, FormGroup, FormLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { MenuItem } from 'material-ui/Menu';
import NumberFormat from 'react-number-format';
import { LinearProgress } from 'material-ui/Progress';
import { CircularProgress } from 'material-ui/Progress';
import HelpOutlineIcon from 'material-ui-icons/HelpOutline';
import HelpIcon from 'material-ui-icons/HelpOutline';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Background from './header.png';



const aes256 = require('aes256');
const bip39 = require('bip39');
const axios = require('axios');
const sha256 = require('sha256');
const isEthereumAddress  = require('is-ethereum-address');
const email = require("email-validator");
const md5 = require('md5');

const instance = axios.create({
  baseURL: 'https://api.fusioncommunity.network/api/v1/',
  headers: {'Authorization': 'Basic RURGRjM5OEZEODYzQTAzRUYzMDRCNjg3RkQ2MzgzODgyMzY2ODM4QkZBN0Q2Njg4QkJFQ0E2NTM3MUMzNkVEOTpDOUQ2QzIwQjNDNTc1RTM1NDVDRjkwMjU0RTIxOUY4RjU2M0ZDQUQ0NjJDRTcwODc5RTA0MzA4MTNDNDVFQTZE'}
});

String.prototype.hexEncode = function(){
    var hex, i;
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: '#3d3d3d',
      contrastText: '#3d3d3d',
      primaryTextColor: '#3d3d3d'
    },
  },
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix=""
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameError: false,
      email: '',
      emailError: false,
      telegram: '',
      telegramError: false,
      wallet: '',
      walletError: false,
      errored: false,
      shortDescription: '',
      shortDescriptionError: false,
      attackScenario: '',
      attackScenarioError: false,
      components: '',
      componentsError: false,
      reproduction: '',
      reproductionError: false,
      details: '',
      detailsError: false
    };

    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.process = this.process.bind(this);
  };
  reset() {
    this.setState({loaded:false})
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    /*if (name == 'wallet'&&isEthereumAddress(event.target.value)) {
      var that = this
      axios.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=	0xd0352a019e9ab9d757776f532377aaebd36fd541&address='+event.target.value+'&tag=latest&apikey=A6R8T2MY9URX6YGFD7T369W4WDY2XBTF26')
      .then(function (response) {
        const stake = Math.round((response.data.result/1000000000000000000) * 100) / 100
        that.setState({stake: stake})
        that.setState({hintStake: 'Your current FSN stake is '+stake+' FSN'})
      })
      .catch(function (err) {
        console.log(err)
      })
    }*/
  };
  handleRadio = (event, value) => {
   this.setState({ value });
  };
  handleQ1 = (event, value) => {
    console.log(value)
   this.setState({ q1: value });
  };
  handleQ2 = (event, value) => {
   this.setState({ q2: value });
  };
  handleQ3 = (event, value) => {
   this.setState({ q3: value });
  };
  handleChecked = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  submit() {
    this.setState({
      loading:true,
      nameError: false,
      emailError:false,
      telegramError:false,
      walletError:false,
      shortDescriptionError: false,
      attackScenarioError: false,
      componentsError: false,
      reproductionError: false,
      detailsError: false
    })
    var error = false;
    if (this.state.name=='') {
      this.setState({ nameError: true });
      error = true;
    }
    if (!email.validate(this.state.email)) {
      this.setState({ emailError: true });
      error = true;
    }
    if (this.state.telegram=='') {
      this.setState({ telegramError: true });
      error = true;
    }
    if (!isEthereumAddress(this.state.wallet)) {
      this.setState({ walletError: true });
      error = true;
    }
    if (this.state.telegram=='') {
      this.setState({ telegramError: true });
      error = true;
    }
    if (this.state.shortDescription=='') {
      this.setState({ shortDescriptionError: true });
      error = true;
    }
    if (this.state.attackScenario=='') {
      this.setState({ attackScenarioError: true });
      error = true;
    }
    if (this.state.components=='') {
      this.setState({ componentsError: true });
      error = true;
    }
    if (this.state.reproduction=='') {
      this.setState({ reproductionError: true });
      error = true;
    }
    if (this.state.details=='') {
      this.setState({ detailsError: true });
      error = true;
    }
    if (error) {
      this.setState({loading: false})
    } else {
      this.setState({key:md5(JSON.stringify(this.state))})
      this.process()
    }
  };
  process() {
    this.setState({loading:true})
    /*const json = JSON.stringify(this.state);
    const mnemonic = bip39.generateMnemonic();
    const encrypted = aes256.encrypt(mnemonic, json);

    const data = {
      e: encrypted.hexEncode(),
      m: mnemonic.hexEncode(),
      u: '19ED40BF62C399B8492EFDA5B9A9184B68CF4D9D4A165B38557B9D14201D0C03',
      p: 'ABD83F6571FA9D495A1301F99A8C8F8C6C7A48C8BEEEA426293BFA77D72C8B81',
      t: new Date().getTime(),
    }
    const seed = JSON.stringify(data)
    const signature = sha256(seed)

    data.s = signature
    var that = this
    instance.post('process', data)
    .then(function (r) {
      const dMnemonic = r.data.data.m.hexDecode()
      const dEncrypted = r.data.data.e.hexDecode()
      const dTime = r.data.data.t
      const dSignature = r.data.data.s

      const sig = {
        e: r.data.data.e,
        m: r.data.data.m,
        t: r.data.data.t
      }
      const dSeed = JSON.stringify(sig)
      const compareSignature = sha256(dSeed)

      if (compareSignature !== dSignature) {

      }
      const payload = aes256.decrypt(dMnemonic, dEncrypted)
      var data = null
      try {
         data = JSON.parse(payload)
      } catch (ex) {

      }*/
      this.setState({loading:false/*, r:data*/})
      this.setState({loaded:true})
    /*})
    .catch(function (error) {
      console.log(error)
      that.setState({loading:false,loaded:true,errored:true,err:error})
    });*/
  };

  render() {
    var style = {}
    var size = 6
    if (this.state.control) {
      style = {display:'none'}
      size = 12
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App" style={{backgroundImage: `url(${Background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'top', backgroundSize:'100% auto', maxHeight:400}}>
          <CssBaseline />
          <Grid container xs={12} justify="center" alignItems="flex-start" direction="row" spacing={8}>
            <Grid item xs={10} lg={4} style={{marginTop:150}}>
              {!this.state.loaded?<Card raised elevation={10} square={false} fullWidth={true}>
                <CardContent>
                  <Grid container xs={12} direction="row" justify="center">
                    <Grid container xs={12} alignItems="flex-start" spacing={16}>
                      <Grid item xs={12}>
                        <Grid container xs={12} direction="column" justify="center" style={{marginLeft:10,marginRight:15}}>
                        <Grid item xs={12}><Typography align='center' variant="headline" component="h2" style={{marginTop:50,marginBottom:50}}>Fusion Bug Bounty Program Submission</Typography></Grid>
                        <Grid item xs={12}><Typography align='center'>{"For full details on the bounty program please visit https://bounty.fusion.org"}</Typography></Grid>
                          <Grid item xs={12} >
                            <TextField required fullWidth={true} color="textSecondary" required error={this.state.nameError} disabled={this.state.loading}
                              id="name" label="Name" value={this.state.name}
                              onChange={this.handleChange('name')} margin="normal" helperText={"You may provide a pseudonym, however it makes you ineligible for an FSN reward"}/>
                          </Grid>
                          <Grid item xs={12} >
                            <TextField required fullWidth={true} color="textSecondary" required error={this.state.emailError} disabled={this.state.loading}
                              id="email" label="Email Address" value={this.state.email}
                              onChange={this.handleChange('email')} margin="normal"/>
                          </Grid>
                          <Grid item style={style} xs={12}>
                            <TextField fullWidth={true}
                              id="telegram" label="Telegram Username" required error={this.state.telegramError} value={this.state.telegram} disabled={this.state.loading}
                              onChange={this.handleChange('telegram')} margin="normal"
                              helperText="Your @ telegram username"/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.walletError} disabled={this.state.loading}
                              id="wallet" label="Wallet Address" value={this.state.wallet}
                              onChange={this.handleChange('wallet')} margin="normal"
                              helperText={"The wallet you wish to receive your bounty in"}/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.shortDescriptionError} disabled={this.state.loading}
                              id="shortDescription" label="Short description" value={this.state.shortDescription}
                              onChange={this.handleChange('shortDescription')} margin="normal"
                              helperText={"Example: Remote Denail-of-service using non-validated blocks"}/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.attackScenarioError} disabled={this.state.loading}
                              id="attackScenario" label="Attack Scenario" value={this.state.attackScenario}
                              onChange={this.handleChange('attackScenario')} margin="normal"
                              helperText={"Example: An attacker can send blocks which may require a high amount of computation (the maximum gasLimit) but has no proof-of-work. If the attacker sends blocks continuously, the attacker may force the victim node to 100% CPU utilization."}/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.componentsError} disabled={this.state.loading}
                              id="components" label="Components" value={this.state.components}
                              onChange={this.handleChange('components')} margin="normal"
                              helperText={"Example: Go client version v0.6.8"}/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.reproductionError} disabled={this.state.loading}
                              id="reproduction" label="Reproduction" value={this.state.reproduction}
                              onChange={this.handleChange('reproduction')} margin="normal"
                              helperText={"Example: Send a block to a testnet node which contains many txs but no valid PoW or put a link to a Github Gist with reproduction details."}/>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth={true} required error={this.state.detailsError} disabled={this.state.loading}
                              id="details" label="Details" value={this.state.details}
                              onChange={this.handleChange('details')} margin="normal"
                              helperText={"Any other details not covered. Can also contain links to GitHub Gists, repos containing code samples, etc."}/>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container xs={12} direction="column" justify="center" spacing={16} style={{margin: theme.spacing.unit,position: 'relative'}}>
                      <Grid item xs={12}>
                        <Button size="large" variant="raised" color="secondary" disabled={this.state.loading} onClick={this.submit}>
                          Done
                        </Button>
                        {this.state.loading && <CircularProgress size={36} style={{position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}}/>}
                      </Grid>
                  </Grid>
                  <Grid container xs={12} direction="row">
                    <LinearProgress />
                  </Grid>
                </CardContent>
              </Card>:
              !this.state.errored?<Card raised elevation={10} square={false} fullWidth={true}>
                <CardContent>
                  <Grid container xs={12} direction="row" justify="center">
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" variant="headline" component="h2">Thank you for your submission!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2">Head over to our community channel for further announcements!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2">Your name is {this.state.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2">Your email address is {this.state.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2">Your wallet is {this.state.wallet}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2">Your key is {this.state.key}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={this.reset}>Back</Button>
                </CardActions>
              </Card>:
              <Card raised elevation={10} square={false} fullWidth={true}>
                <CardContent>
                  <Grid container xs={12} direction="row" justify="center">
                  <Grid item xs={12}>
                    <Typography align='center' color="textSecondary" variant="headline" component="h2">Error Encountered</Typography>
                  </Grid>
                    <Grid item xs={12}>
                      <Typography align='center' color="textSecondary" component="h2" style={{margin:100,color:'#E91E63'}}>{this.state.err.toString()}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={this.reset}>Back</Button>
                </CardActions>
              </Card>}
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
