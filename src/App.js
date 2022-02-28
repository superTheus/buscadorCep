import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import './styles.css'
import api from './services/api'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function App() {

  const [cep, setCep] = useState("");
  const [cepResultado, setCepResultado] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [existCep, setExistCep] = useState(false);
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertDanger, setOpenAlertDanger] = useState(false);
  const [openAlertWarning, setOpenAlertWarning] = useState(false);
  const [openAlertInfo, setOpenAlertInfo] = useState(false);

  const validaCepValido = () => {
    if (cep === '' || cep.length < 8) {
      setAlert('info');
      return false;
    }

    return true;
  }

  const handlerCep = async () => {
    const valorVerificado = await validaCepValido();
    if (valorVerificado) {
      try {
        const response = await api.get(`${cep}/json`);

        if (response.data.erro) {
          setAlert('warning');
        } else {
          montarDadosTela(response.data);
        }
      } catch (erro) {
        setAlert('danger');
      }
    }
  }

  function montarDadosTela(dados) {
    setBairro(dados.bairro);
    setCepResultado(dados.cep);
    setComplemento(dados.complemento);
    setUf(dados.uf);
    setCidade(dados.localidade);
    setRua(dados.logradouro);
    setExistCep(true);
    setAlert('success');
  }

  function acaoEnter(code) {
    if (code === 'Enter') {
      handlerCep();
    }
  }

  function setAlert(type) {
    if (type === 'success') {
      setOpenAlertSuccess(true);
    } else if (type === 'danger') {
      setOpenAlertDanger(true);
    } else if (type === 'warning') {
      setOpenAlertWarning(true);
    } else if (type === 'info') {
      setOpenAlertInfo(true);
    }

    setTimeout(() => {
      setOpenAlertSuccess(false);
      setOpenAlertDanger(false);
      setOpenAlertWarning(false);
      setOpenAlertInfo(false);
    }, 3000);

  }

  return (
    <div>
      <div className="alertArea">
        {
          openAlertSuccess &&
          <Stack sx={{ width: '25%' }} spacing={2}>
            <Alert severity="success" onClose={() => setOpenAlertSuccess(false)}>Cep encontrado</Alert>
          </Stack>
        }
        {
          openAlertDanger &&
          <Stack sx={{ width: '25%' }} spacing={2}>
            <Alert severity="error" onClose={() => setOpenAlertDanger(false)}>Ops... Não conseguimos encontrar o CEP</Alert>
          </Stack>
        }
        {
          openAlertWarning &&
          <Stack sx={{ width: '25%' }} spacing={2}>
            <Alert severity="warning" onClose={() => setOpenAlertWarning(false)}>CEP Não Encontrado</Alert>
          </Stack>
        }
        {
          openAlertInfo &&
          <Stack sx={{ width: '25%' }} spacing={2}>
            <Alert severity="info" onClose={() => setOpenAlertInfo(false)}>CEP Inválido</Alert>
          </Stack>
        }
      </div>
      
      <div className="container">
        <h1 className="title">Buscador CEP</h1>

        <div className="containerInput">
          <input
            type="text"
            value={cep}
            placeholder="Digite seu Cep..."
            onChange={(e) => setCep(e.target.value)}
            maxLength={8}
            onKeyPress={(e) => acaoEnter(e.code)}
          />

          <button className="buttonSearch" onClick={handlerCep}>
            <FiSearch size={25} color="#fff" />
          </button>

        </div>

        {
          existCep &&
          <main className="main">
            <h2>CEP: {cepResultado}</h2>
            {
              rua.length >= 1 &&
              < span > {rua}</span>
            }
            {
              complemento.length >= 1 &&
              <span>Complemento: {complemento}</span>
            }
            <span>{bairro}</span>
            <span>{cidade} -  {uf}</span>
          </main>
        }

      </div >
    </div>
  );
}

export default App;
