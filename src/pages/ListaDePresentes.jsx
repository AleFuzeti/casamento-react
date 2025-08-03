// src/pages/ListaDePresentes.jsx
import React, { useState, useEffect } from 'react';
import '../styles/presentes.css';
import FotoTexto from './FotoTexto';
import QRCode from 'qrcode';

const ListaDePresentes = () => {
  const [presentes, setPresentes] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [codigoPix, setCodigoPix] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const carregarPresentes = () => {
    // Para GitHub Pages, carregamos diretamente do arquivo JSON na pasta public
    fetch(`${process.env.PUBLIC_URL}/static/presentes.json`)
      .then(response => response.json())
      .then(data => setPresentes(data))
      .catch(error => console.error("Erro ao carregar presentes:", error));
  };

  useEffect(() => {
    carregarPresentes();
  }, []);

  const ordenarMaiorPreco = () => {
    const ordenados = [...presentes].sort((a, b) => b.preco - a.preco);
    setPresentes(ordenados);
  };

  const ordenarMenorPreco = () => {
    const ordenados = [...presentes].sort((a, b) => a.preco - b.preco);
    setPresentes(ordenados);
  };

  const abrirOverlay = () => {
    setOverlayVisible(true);
  };

  const fecharOverlay = () => {
    setOverlayVisible(false);
  };

  // Função para gerar o código PIX
  const gerar_pix_copiaecola = (chave_pix, nome_recebedor, cidade_recebedor, valor = null, identificador = "***") => {
    function format_field(id, content) {
      const length = String(content.length).padStart(2, '0');
      return `${id}${length}${content}`;
    }

    // Montagem do payload EMV
    let payload = "";
    payload += format_field("00", "01");
    payload += format_field("26",
      format_field("00", "br.gov.bcb.pix") +
      format_field("01", chave_pix)
    );
    payload += format_field("52", "0000");
    payload += format_field("53", "986");
    
    if (valor !== null) {
      payload += format_field("54", (parseFloat(valor)).toFixed(2));
    }
    
    payload += format_field("58", "BR");
    payload += format_field("59", nome_recebedor.substring(0, 25));
    payload += format_field("60", cidade_recebedor.substring(0, 15));
    payload += format_field("62", format_field("05", identificador));

    const payload_sem_crc = payload + "6304";
    const crc = calcular_crc16(payload_sem_crc);
    const payload_completo = payload_sem_crc + crc;
    return payload_completo;
  };

  const calcular_crc16 = (payload) => {
    let crc = 0xFFFF;
    for (let ch of payload) {
      crc ^= ch.charCodeAt(0) << 8;
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };

  const selecionarPresente = async (presente) => {
    const codigo = gerar_pix_copiaecola(
      "+5543988030433",
      "ALEXANDRE FUZETI BERTIPAGLIA",
      "Londrina",
      presente.preco,
      presente.nome
    );
    
    console.log("Código PIX gerado:", codigo);
    setCodigoPix(codigo);
    
    // Gerar QR Code
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(codigo, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
    
    abrirOverlay();
  };

  return (
    <main>
      <section id="foto-casal">
        <img src={`${process.env.PUBLIC_URL}/assets/foto-casal.jpg`} alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>

      <FotoTexto titulo="A Lista de Presentes">
        <p>Devido aos noivos já possuírem a maioria dos itens necessários para a casa, optamos por uma lista de presentes virtual. Esses presentes são simbólicos e representam uma contribuição para a nossa lua de mel e vida a dois.</p>
        <p>Os itens possuem cunho cômico e valores aproximados, para que você possa escolher o que mais lhe agrada. A contribuição é feita por PIX, onde você pode escolher o presente que deseja nos dar e fazer a contribuição diretamente.</p> 
        <p>Ao selecionar o presente, você será redirecionado ao código PIX e QR Code para efetuar a contribuição.</p>
        <p>Agradecemos muito a sua contribuição e apoio em nosso grande dia!</p>
      </FotoTexto>

      <div id="opcoes-ordenacao">
        <button onClick={carregarPresentes}>Ordenar por Relevância</button>
        <button onClick={ordenarMaiorPreco}>Ordenar por Maior Preço</button>
        <button onClick={ordenarMenorPreco}>Ordenar por Menor Preço</button>
      </div>

      <section id="presentes">
        <div className="presentes">
          {presentes.map((presente, index) => (
            <div className="presente" key={index}>
              <img src={`${process.env.PUBLIC_URL}/assets/presentes/${presente.foto}`} alt={presente.nome} />
              <h3>{presente.nome}</h3>
              <h2 className="preco">R$ {presente.preco.toFixed(2)}</h2>
              <button className="botao-comprar" onClick={() => selecionarPresente(presente)}>Comprar</button>
            </div>
          ))}
        </div>
      </section>

      {overlayVisible && (
        <div id="overlay" onClick={fecharOverlay} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div id="overlay-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            textAlign: 'center',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>PIX para Pagamento</h3>
            
            {qrCodeUrl && (
              <div style={{ marginBottom: '20px' }}>
                <img src={qrCodeUrl} alt="QR Code PIX" style={{ maxWidth: '256px', height: 'auto' }} />
              </div>
            )}
            
            <p style={{ fontSize: '1.2em', margin: '15px 0', color: '#333', fontWeight: 'bold' }}>Código PIX:</p>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              border: '1px solid #ddd'
            }}>
              <p style={{ 
                fontSize: '0.9em', 
                color: '#333', 
                wordBreak: 'break-all', 
                fontFamily: 'monospace',
                margin: 0
              }}>
                {codigoPix}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => navigator.clipboard.writeText(codigoPix)}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Copiar Código
              </button>
              <button 
                onClick={fecharOverlay}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ListaDePresentes;
