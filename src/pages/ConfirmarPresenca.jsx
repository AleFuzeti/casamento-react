import React, { useState, useEffect } from 'react';
import '../styles/confirmar-presenca.css';
import { convidadosService } from '../services/convidadosService';
import AdminPanel from '../components/AdminPanel';

const DATA_LIMITE = new Date('2025-08-30T23:59:59');

const ConfirmarPresenca = () => {
  const [codigo, setCodigo] = useState('');
  const [convidados, setConvidados] = useState([]);
  const [convidadoAtual, setConvidadoAtual] = useState(null);
  const [selecionados, setSelecionados] = useState([]);
  const [dataLimitePassou, setDataLimitePassou] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [listaSimples, setListaSimples] = useState(false);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState('');

  // Carregar dados dos convidados do Firebase
  useEffect(() => {
    const carregarConvidados = async () => {
      setLoading(true);
      try {
        const dadosConvidados = await convidadosService.buscarConvidados();
        setConvidados(dadosConvidados);
      } catch (error) {
        console.error('Erro ao carregar convidados:', error);
        // Fallback para arquivo estático
        try {
          const response = await fetch('/casamento-react/static/convidados.json');
          const data = await response.json();
          setConvidados(data);
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
        }
      }
      setLoading(false);
    };

    carregarConvidados();
    
    setDataLimitePassou(new Date() > DATA_LIMITE);
  }, []);

  const buscarConvidado = async () => {
    // Código especial para visualizar todos os confirmados
    if (codigo.trim().toUpperCase() === 'M0M0') {
      setMensagemConfirmacao(''); // Limpar mensagem ao buscar novo código
      setLoading(true);
      try {
        // Buscar dados atualizados do Firebase
        const dadosAtualizados = await convidadosService.buscarConvidados();
        if (dadosAtualizados && dadosAtualizados.length > 0) {
          setRelatorio(dadosAtualizados);
          setConvidados(dadosAtualizados); // Atualizar também o estado local
        } else {
          // Fallback para dados locais se Firebase não responder
          setRelatorio(convidados);
        }
      } catch (error) {
        console.error('Erro ao buscar dados atualizados:', error);
        setRelatorio(convidados); // Usar dados locais em caso de erro
      }
      setConvidadoAtual(null);
      setSelecionados([]);
      setListaSimples(false); // Resetar para vista por convite
      setLoading(false);
      return;
    }

    // Código especial para painel de administração
    if (codigo.trim().toUpperCase() === 'ADMIN') {
      setShowAdminPanel(true);
      return;
    }

    setRelatorio(null);
    setMensagemConfirmacao(''); // Limpar mensagem ao buscar novo código
    setLoading(true);

    try {
      const convidado = await convidadosService.buscarPorCodigo(codigo.trim());
      if (!convidado) {
        alert('Código não encontrado.');
        setConvidadoAtual(null);
        setLoading(false);
        return;
      }
      setConvidadoAtual(convidado);
      setSelecionados(convidado.confirmados || []);
    } catch (error) {
      console.error('Erro ao buscar convidado:', error);
      alert('Erro ao buscar convidado. Tente novamente.');
    }
    setLoading(false);
  };

  const handleCheckbox = (nome) => {
    setSelecionados(prev =>
      prev.includes(nome)
        ? prev.filter(n => n !== nome)
        : [...prev, nome]
    );
  };

  const confirmarPresenca = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagemConfirmacao(''); // Limpar mensagem anterior

    try {
      const resultado = await convidadosService.confirmarPresenca(convidadoAtual.codigo, selecionados);
      
      if (resultado.success) {
        // Atualizar estado local
        const novoConvidado = {
          ...convidadoAtual,
          confirmados: [...selecionados],
          confirmado: selecionados.length > 0,
          dataConfirmacao: new Date().toISOString()
        };
        
        const novosConvidados = convidados.map(c =>
          c.codigo === novoConvidado.codigo ? novoConvidado : c
        );
        setConvidados(novosConvidados);
        setConvidadoAtual(novoConvidado);
        
        // Manter os selecionados como estão para mostrar o estado atual
        // setSelecionados([...selecionados]); // Não precisamos alterar, já está correto
        
        // Mostrar mensagem de sucesso
        const numConfirmados = selecionados.length;
        const mensagem = numConfirmados > 0 
          ? `✅ Presença confirmada! ${numConfirmados} pessoa${numConfirmados > 1 ? 's' : ''} confirmada${numConfirmados > 1 ? 's' : ''}.`
          : '❌ Presença cancelada.';
        
        setMensagemConfirmacao(mensagem);
        
        // Fazer a mensagem desaparecer após 5 segundos
        setTimeout(() => {
          setMensagemConfirmacao('');
        }, 5000);
        
      } else {
        setMensagemConfirmacao('❌ Erro ao confirmar presença. Tente novamente.');
        setTimeout(() => {
          setMensagemConfirmacao('');
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      setMensagemConfirmacao('❌ Erro ao confirmar presença. Tente novamente.');
      setTimeout(() => {
        setMensagemConfirmacao('');
      }, 5000);
    }
    
    setLoading(false);
  };

  const gerarListaSimples = () => {
    if (!relatorio) return [];
    
    const confirmados = [];
    relatorio.forEach(convite => {
      if (convite.confirmados && convite.confirmados.length > 0) {
        confirmados.push(...convite.confirmados);
      }
    });
    
    // Remover duplicatas e ordenar alfabeticamente
    return [...new Set(confirmados)].sort();
  };

  const copiarListaSimples = async () => {
    const lista = gerarListaSimples();
    if (lista.length === 0) {
      alert('Não há nomes confirmados para copiar.');
      return;
    }

    const textoParaCopiar = lista.join('\n');
    
    try {
      await navigator.clipboard.writeText(textoParaCopiar);
      // Mostrar feedback visual temporário
      const botao = document.querySelector('[data-copy-button]');
      const textoOriginal = botao.textContent;
      botao.textContent = '✅ Copiado!';
      botao.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.backgroundColor = '#2196F3';
      }, 2000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = textoParaCopiar;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        alert('Lista copiada para a área de transferência!');
      } catch (fallbackErr) {
        console.error('Erro ao copiar:', fallbackErr);
        alert('Não foi possível copiar a lista. Copie manualmente.');
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <main>
      <section id="foto-casal">
        <img src="/casamento-react/assets/foto-casal.jpg" alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>
      
      <section id="codigo-convite">
        <h2>Digite seu código de convite:</h2>
        
        <div className="input-container">
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            disabled={loading}
            placeholder="Digite seu código..."
          />
          <button onClick={buscarConvidado} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Mensagem de confirmação */}
        {mensagemConfirmacao && (
          <div style={{
            marginTop: 15,
            padding: 12,
            borderRadius: 6,
            backgroundColor: mensagemConfirmacao.includes('✅') ? '#e8f5e9' : '#ffebee',
            color: mensagemConfirmacao.includes('✅') ? '#2e7d32' : '#c62828',
            border: `1px solid ${mensagemConfirmacao.includes('✅') ? '#c8e6c9' : '#ffcdd2'}`,
            textAlign: 'center',
            fontWeight: 'bold',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            {mensagemConfirmacao}
          </div>
        )}

        {loading && <p>Carregando dados do Firebase...</p>}


        {/* Exibe o relatório se existir */}
        {relatorio && (
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: '10px' }}>
              <h3>📋 Lista de Convidados</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setListaSimples(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: !listaSimples ? '#4CAF50' : '#e0e0e0',
                    color: !listaSimples ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  📋 Por Convite
                </button>
                <button 
                  onClick={() => setListaSimples(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: listaSimples ? '#2196F3' : '#e0e0e0',
                    color: listaSimples ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  📝 Lista Simples
                </button>
                <button 
                  onClick={() => {
                    setRelatorio(null);
                    setListaSimples(false);
                    setMensagemConfirmacao(''); // Limpar mensagem ao fechar
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✖ Fechar
                </button>
              </div>
            </div>
            
            {listaSimples ? (
              // Lista simples com apenas nomes dos confirmados
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div style={{ 
                  padding: 20, 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 8,
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: '10px' }}>
                    <h4 style={{ margin: 0, color: '#2e7d32' }}>✅ Confirmados ({gerarListaSimples().length} pessoas)</h4>
                    {gerarListaSimples().length > 0 && (
                      <button 
                        data-copy-button
                        onClick={copiarListaSimples}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'background-color 0.3s'
                        }}
                      >
                        📋 Copiar Lista
                      </button>
                    )}
                  </div>
                  {gerarListaSimples().length > 0 ? (
                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: 15, 
                      borderRadius: 6,
                      border: '1px solid #e0e0e0'
                    }}>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        columns: window.innerWidth > 768 ? 2 : 1,
                        columnGap: '30px'
                      }}>
                        {gerarListaSimples().map((nome, index) => (
                          <li key={index} style={{ 
                            padding: '4px 0', 
                            borderBottom: '1px solid #f0f0f0',
                            breakInside: 'avoid',
                            fontSize: '15px'
                          }}>
                            • {nome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma confirmação ainda</p>
                  )}
                  
                  <div style={{ 
                    marginTop: 15, 
                    padding: 10, 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: 4,
                    fontSize: '14px',
                    color: '#2e7d32'
                  }}>
                    📊 <strong>Total:</strong> {gerarListaSimples().length} pessoas confirmadas de {relatorio.reduce((total, c) => total + (c.nomes?.length || 0), 0)} convidados
                  </div>
                </div>
              </div>
            ) : (
              // Lista detalhada por convite (código original)
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {relatorio.map((convite, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: 20, 
                    padding: 15, 
                    border: '1px solid #ddd', 
                    borderRadius: 8,
                    backgroundColor: convite.confirmado ? '#e8f5e9' : '#fff3e0'
                  }}>
                    <div style={{ marginBottom: 10 }}>
                      <strong>👥 Convidados:</strong>
                      <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                        {(convite.nomes || []).map((nome, i) => (
                          <li key={i} style={{ margin: '3px 0' }}>{nome}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <strong>✅ Confirmaram presença:</strong>
                      {convite.confirmados && convite.confirmados.length > 0 ? (
                        <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                          {convite.confirmados.map((nome, i) => (
                            <li key={i} style={{ margin: '3px 0', color: '#2e7d32' }}>{nome}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#888', marginLeft: 10 }}>Nenhum confirmado ainda</span>
                      )}
                    </div>
                    
                    {convite.dataConfirmacao && (
                      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                        📅 Confirmado em: {new Date(convite.dataConfirmacao).toLocaleDateString('pt-BR')} às {new Date(convite.dataConfirmacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <h4>📊 Resumo:</h4>
              <p>📋 Total de convites: {relatorio.length}</p>
              <p>✅ Convites confirmados: {relatorio.filter(c => c.confirmado).length}</p>
              <p>❌ Convites não confirmados: {relatorio.filter(c => !c.confirmado).length}</p>
              <p>👥 Total de pessoas confirmadas: {relatorio.reduce((total, c) => total + (c.confirmados?.length || 0), 0)}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: 10 }}>
                🔄 Dados atualizados em tempo real do Firebase
              </p>
            </div>
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
                <div className="checkbox-container">
                  {convidadoAtual.nomes.map((nome, i) => (
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={selecionados.includes(nome)}
                        onChange={() => handleCheckbox(nome)}
                      />
                      <span>{nome}</span>
                      {convidadoAtual.confirmados && convidadoAtual.confirmados.includes(nome) && (
                        <span style={{ marginLeft: 'auto', color: '#4CAF50', fontSize: '12px', fontWeight: 'bold' }}>✅ Confirmado</span>
                      )}
                    </label>
                  ))}
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Confirmando...' : 'Confirmar Presença'}
                </button>
                <p style={{ marginTop: 8, color: '#888', fontSize: 13 }}>
                  Você pode alterar sua confirmação até {DATA_LIMITE.toLocaleDateString()}.
                </p>
              </form>
            )}
          </div>
        )}
      </section>
      
      {/* Painel de Administração */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </main>
  );
};

export default ConfirmarPresenca;
