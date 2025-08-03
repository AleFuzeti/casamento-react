// src/utils/migrateData.js
import { database } from '../firebase/config';
import { ref, set, get } from 'firebase/database';

export const migrarConvidadosParaFirebase = async () => {
  try {
    console.log('🔄 Iniciando migração dos dados...');
    
    // Carregar dados do arquivo JSON
    const response = await fetch('/casamento-react/static/convidados.json');
    const convidados = await response.json();
    
    console.log(`📊 Encontrados ${convidados.length} convidados para migrar`);
    
    // Verificar se já existem dados no Firebase
    const convidadosRef = ref(database, 'convidados');
    const snapshot = await get(convidadosRef);
    
    if (snapshot.exists()) {
      console.log('⚠️  Dados já existem no Firebase. Deseja sobrescrever? (confirme no console)');
      const confirmar = window.confirm('Já existem dados no Firebase. Deseja sobrescrever?');
      if (!confirmar) {
        console.log('❌ Migração cancelada pelo usuário');
        return { success: false, message: 'Migração cancelada' };
      }
    }
    
    // Migrar cada convidado
    for (let i = 0; i < convidados.length; i++) {
      const convidado = convidados[i];
      const convidadoRef = ref(database, `convidados/${i}`);
      
      await set(convidadoRef, {
        codigo: convidado.codigo,
        nomes: convidado.nomes,
        confirmados: convidado.confirmados || [],
        confirmado: convidado.confirmado || false,
        dataCriacao: new Date().toISOString()
      });
      
      console.log(`✅ Migrado: ${convidado.codigo} (${i + 1}/${convidados.length})`);
    }
    
    console.log('🎉 Migração concluída com sucesso!');
    return { 
      success: true, 
      message: `${convidados.length} convidados migrados com sucesso!` 
    };
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    return { 
      success: false, 
      message: `Erro: ${error.message}` 
    };
  }
};

export const verificarConexaoFirebase = async () => {
  try {
    const testRef = ref(database, 'teste');
    await set(testRef, 'conexao-ok');
    console.log('✅ Conexão com Firebase funcionando!');
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    return false;
  }
};

export const buscarTodosConfirmados = async () => {
  try {
    console.log('🔍 Buscando todos os confirmados...');
    
    const convidadosRef = ref(database, 'convidados');
    const snapshot = await get(convidadosRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const todosConvidados = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      
      const confirmados = todosConvidados.filter(convidado => convidado.confirmado);
      const naoConfirmados = todosConvidados.filter(convidado => !convidado.confirmado);
      
      console.log(`✅ Confirmados: ${confirmados.length}`);
      console.log(`❌ Não confirmados: ${naoConfirmados.length}`);
      console.log(`📊 Total: ${todosConvidados.length}`);
      
      return {
        success: true,
        confirmados,
        naoConfirmados,
        total: todosConvidados.length,
        estatisticas: {
          totalConfirmados: confirmados.length,
          totalNaoConfirmados: naoConfirmados.length,
          percentualConfirmacao: Math.round((confirmados.length / todosConvidados.length) * 100)
        }
      };
    }
    
    return {
      success: false,
      message: 'Nenhum dado encontrado no Firebase'
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar confirmados:', error);
    return {
      success: false,
      message: `Erro: ${error.message}`
    };
  }
};
