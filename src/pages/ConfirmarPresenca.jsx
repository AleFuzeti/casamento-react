import React, { useState, useEffect } from 'react';
import '../styles/confirmar-presenca.css';

const DATA_LIMITE = new Date('2025-06-30T23:59:59');

const ConfirmarPresenca = () => {
  const [codigo, setCodigo] = useState('');
  const [convidados, setConvidados] = useState([]);
  const [convidadoAtual, setConvidadoAtual] = useState(null);
  const [selecionados, setSelecionados] = useState([]);
  const [dataLimitePassou, setDataLimitePassou] = useState(false);
  const [relatorio, setRelatorio] = useState(null); // NOVO

  useEffect(() => {
    fetch('http://localhost:4000/api/convidados')
      .then(res => res.json())
      .then(data => setConvidados(data));
    setDataLimitePassou(new Date() > DATA_LIMITE);
  }, []);

  const buscarConvidado = () => {
    // Código especial para visualizar todos os confirmados
    if (codigo.trim().toUpperCase() === 'M0M0') {
      fetch('http://localhost:4000/api/convidados')
        .then(res => res.json())
        .then(data => {
          setRelatorio(data); // Salva o relatório para exibir no HTML
        });
      setConvidadoAtual(null);
      setSelecionados([]);
      return;
    }

    setRelatorio(null); // Limpa relatório se não for o código especial

    const c = convidados.find(
      c => c.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );
    if (!c) {
      alert('Código não encontrado.');
      setConvidadoAtual(null);
      return;
    }
    setConvidadoAtual(c);
    setSelecionados(c.confirmados || []);
  };

  const handleCheckbox = (nome) => {
    setSelecionados(prev =>
      prev.includes(nome)
        ? prev.filter(n => n !== nome)
        : [...prev, nome]
    );
  };

  const confirmarPresenca = (e) => {
    e.preventDefault();
    const novoConvidado = {
      ...convidadoAtual,
      confirmados: [...selecionados],
      confirmado: selecionados.length > 0
    };
    setConvidados(convidados.map(c =>
      c.codigo === novoConvidado.codigo ? novoConvidado : c
    ));
    setConvidadoAtual(novoConvidado);
    setSelecionados([]);
    alert('Presença confirmada!');

    fetch('http://localhost:4000/api/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, nomesConfirmados: selecionados }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Presença confirmada com sucesso no servidor!');
          fetch('http://localhost:4000/api/convidados')
            .then(res => res.json())
            .then(data => setConvidados(data));
        } else {
          alert('Erro ao confirmar presença no servidor.');
        }
      })
      .catch(err => {
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor.');
      });
  };

  return (
    <main>
      <section id="foto-casal">
        <img src="/assets/foto-casal.jpg" alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>
      
      <section id="codigo-convite">
        <h2>Digite seu código de convite:</h2>
        <input
          type="text"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
        />
        <button onClick={buscarConvidado}>Buscar</button>

        {/* Exibe o relatório se existir */}
        {relatorio && (
          <div style={{ marginTop: 30 }}>
            <h3>Todos os convites e confirmados:</h3>
            <ul>
              {relatorio.map((convite, idx) => (
                <li key={idx} style={{ marginBottom: 16 }}>
                  <strong>Convite:</strong> {convite.codigo}<br />
                  <strong>Nomes:</strong> {convite.nomes.join(', ')}<br />
                  <strong>Confirmados:</strong> {convite.confirmados && convite.confirmados.length > 0
                    ? convite.confirmados.join(', ')
                    : <span style={{ color: '#888' }}>Nenhum</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ...restante do seu código para exibir o formulário normalmente... */}
        {!relatorio && convidadoAtual && (
          <div style={{ marginTop: 30 }}>
            <h3>Convidados do convite:</h3>
            {dataLimitePassou ? (
              <div>
                <p>O prazo para confirmação já terminou.</p>
                <ul>
                  {convidadoAtual.confirmados && convidadoAtual.confirmados.length === 0 ? (
                    <li>Nenhum convidado confirmou presença ainda.</li>
                  ) : (
                    convidadoAtual.confirmados.map((nome, i) => (
                      <li key={i}>{nome}</li>
                    ))
                  )}
                </ul>
              </div>
            ) : (
              <form onSubmit={confirmarPresenca}>
                {convidadoAtual.nomes.map((nome, i) => (
                  <label key={i} style={{ display: 'block', margin: '8px 0' }}>
                    <input
                      type="checkbox"
                      checked={selecionados.includes(nome)}
                      onChange={() => handleCheckbox(nome)}
                    />
                    {nome}
                  </label>
                ))}
                <button type="submit" style={{ marginTop: 16 }}>Confirmar Presença</button>
                <p style={{ marginTop: 8, color: '#888', fontSize: 13 }}>
                  Você pode alterar sua confirmação até {DATA_LIMITE.toLocaleDateString()}.
                </p>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default ConfirmarPresenca;
