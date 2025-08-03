// src/components/AdminPanel.jsx
import React, { useState } from 'react';
import { migrarConvidadosParaFirebase, verificarConexaoFirebase, buscarTodosConfirmados } from '../utils/migrateData';

const AdminPanel = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [relatorioConfirmados, setRelatorioConfirmados] = useState(null);

  const testarConexao = async () => {
    setLoading(true);
    setMessage('Testando conexão...');
    
    const resultado = await verificarConexaoFirebase();
    if (resultado) {
      setMessage('✅ Conexão com Firebase OK!');
    } else {
      setMessage('❌ Erro de conexão com Firebase');
    }
    setLoading(false);
  };

  const migrarDados = async () => {
    setLoading(true);
    setMessage('Migrando dados...');
    
    const resultado = await migrarConvidadosParaFirebase();
    setMessage(resultado.message);
    setLoading(false);
  };

  const verConfirmados = async () => {
    setLoading(true);
    setMessage('Buscando confirmados...');
    
    const resultado = await buscarTodosConfirmados();
    if (resultado.success) {
      setRelatorioConfirmados(resultado);
      setMessage(`📊 Relatório carregado! ${resultado.estatisticas.totalConfirmados} confirmados de ${resultado.total} convidados (${resultado.estatisticas.percentualConfirmacao}%)`);
    } else {
      setMessage(resultado.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>🔧 Painel de Administração</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={testarConexao} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testando...' : 'Testar Conexão Firebase'}
          </button>
          
          <button 
            onClick={migrarDados} 
            disabled={loading}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Migrando...' : 'Migrar Dados'}
          </button>

          <button 
            onClick={verConfirmados} 
            disabled={loading}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginLeft: '10px'
            }}
          >
            {loading ? 'Carregando...' : 'Ver Todos os Confirmados'}
          </button>
        </div>
        
        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </div>
        )}
        
        {relatorioConfirmados && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '5px',
            marginBottom: '20px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h4>📊 Relatório de Confirmações</h4>
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
              <strong>Estatísticas:</strong><br/>
              📋 Total de Convidados: {relatorioConfirmados.total}<br/>
              ✅ Confirmados: {relatorioConfirmados.estatisticas.totalConfirmados}<br/>
              ❌ Não Confirmados: {relatorioConfirmados.estatisticas.totalNaoConfirmados}<br/>
              📈 Taxa de Confirmação: {relatorioConfirmados.estatisticas.percentualConfirmacao}%
            </div>
            
            <h5>✅ Confirmados ({relatorioConfirmados.confirmados.length}):</h5>
            <div style={{ marginBottom: '15px' }}>
              {relatorioConfirmados.confirmados.map((convidado, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  margin: '5px 0', 
                  backgroundColor: '#c8e6c9', 
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  <strong>Código:</strong> {convidado.codigo}<br/>
                  <strong>Convidados:</strong> {convidado.nomes?.join(', ')}<br/>
                  <strong>Confirmaram:</strong> {convidado.confirmados?.join(', ') || 'Nenhum'}<br/>
                  {convidado.dataConfirmacao && <span><strong>Data:</strong> {new Date(convidado.dataConfirmacao).toLocaleString('pt-BR')}</span>}
                </div>
              ))}
            </div>
            
            <h5>❌ Não Confirmados ({relatorioConfirmados.naoConfirmados.length}):</h5>
            <div>
              {relatorioConfirmados.naoConfirmados.map((convidado, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  margin: '5px 0', 
                  backgroundColor: '#ffcdd2', 
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  <strong>Código:</strong> {convidado.codigo}<br/>
                  <strong>Convidados:</strong> {convidado.nomes?.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <h3>Instruções:</h3>
          <ol>
            <li>🔍 Primeiro, teste a conexão com Firebase</li>
            <li>📤 Se OK, clique em "Migrar Dados" (apenas na primeira vez)</li>
            <li>📊 Use "Ver Todos os Confirmados" para relatório detalhado</li>
            <li>🌐 Verifique no Firebase Console se os dados aparecem</li>
          </ol>
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '5px' }}>
            <strong>💡 Dicas:</strong><br/>
            • Use o código <code>M0M0</code> na página principal para ver resumo<br/>
            • Use o código <code>ADMIN</code> para abrir este painel<br/>
            • Data limite para confirmações: <strong>30/08/2025</strong>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
