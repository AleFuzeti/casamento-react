// src/services/convidadosService.js
import { database } from '../firebase/config';
import { ref, push, set, get, update } from 'firebase/database';

export const convidadosService = {
  // Buscar todos os convidados
  async buscarConvidados() {
    try {
      const convidadosRef = ref(database, 'convidados');
      const snapshot = await get(convidadosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      return [];
    }
  },

  // Confirmar presença
  async confirmarPresenca(codigo, nomesConfirmados) {
    try {
      const convidadosRef = ref(database, 'convidados');
      const snapshot = await get(convidadosRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        let convidadoEncontrado = null;
        let convidadoKey = null;

        // Buscar pelo código
        Object.keys(data).forEach(key => {
          if (data[key].codigo && data[key].codigo.toUpperCase() === codigo.toUpperCase()) {
            convidadoEncontrado = data[key];
            convidadoKey = key;
          }
        });

        if (convidadoEncontrado) {
          // Atualizar o convidado
          const updates = {
            confirmados: nomesConfirmados,
            confirmado: nomesConfirmados.length > 0,
            dataConfirmacao: new Date().toISOString()
          };

          const convidadoRef = ref(database, `convidados/${convidadoKey}`);
          await update(convidadoRef, updates);
          
          return { success: true, message: 'Presença confirmada com sucesso!' };
        } else {
          return { success: false, message: 'Código de convite não encontrado.' };
        }
      }
      
      return { success: false, message: 'Nenhum convidado encontrado.' };
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  },

  // Buscar convidado por código
  async buscarPorCodigo(codigo) {
    try {
      const convidadosRef = ref(database, 'convidados');
      const snapshot = await get(convidadosRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        for (const key in data) {
          if (data[key].codigo && data[key].codigo.toUpperCase() === codigo.toUpperCase()) {
            return { id: key, ...data[key] };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar convidado:', error);
      return null;
    }
  },

  // Adicionar convidado (para migração inicial)
  async adicionarConvidado(convidado) {
    try {
      const convidadosRef = ref(database, 'convidados');
      const novoConvidadoRef = push(convidadosRef);
      await set(novoConvidadoRef, convidado);
      return { success: true, id: novoConvidadoRef.key };
    } catch (error) {
      console.error('Erro ao adicionar convidado:', error);
      return { success: false, error };
    }
  }
};
