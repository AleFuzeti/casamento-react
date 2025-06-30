const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const convidadosPath = path.join(__dirname, '../src/data/convidados.json');

app.post('/api/confirmar', (req, res) => {
  const { codigo, nomesConfirmados } = req.body;

  console.log('🔔 Requisição recebida em /api/confirmar');
  console.log('📦 Dados recebidos:', { codigo, nomesConfirmados });

  if (!codigo || !Array.isArray(nomesConfirmados)) {
    console.log('❌ Dados inválidos recebidos.');
    return res.status(400).json({ success: false, message: 'Dados inválidos' });
  }

  let convidadosRaw;
  try {
    convidadosRaw = fs.readFileSync(convidadosPath, 'utf8');
    console.log('📄 Leitura do arquivo convidados.json realizada com sucesso');
  } catch (err) {
    console.error('❌ Erro ao ler o arquivo convidados.json:', err);
    return res.status(500).json({ success: false, message: 'Erro ao ler dados' });
  }

  let convidados;
  try {
    convidados = JSON.parse(convidadosRaw);
    console.log('📚 JSON parse concluído. Total de convidados:', convidados.length);
  } catch (err) {
    console.error('❌ Erro ao fazer parse do JSON:', err);
    return res.status(500).json({ success: false, message: 'Erro no parse do JSON' });
  }

  let encontrado = false;

  // Atualiza o convidado removendo ou adicionando nomes conforme enviado (inclusive vazio)
  const novosConvidados = convidados.map(convidado => {
    // Compara códigos em maiúsculo para aceitar QWE12 e qwe12
    if ((convidado.codigo || '').toUpperCase() === (codigo || '').toUpperCase()) {
      encontrado = true;
      console.log('✅ Código encontrado:', codigo);
      console.log('👥 Convidado antes da atualização:', convidado);

      const atualizado = {
        ...convidado,
        confirmados: [...nomesConfirmados], // sobrescreve com o array enviado (pode ser vazio)
        confirmado: nomesConfirmados.length > 0
      };

      console.log('📝 Convidado atualizado:', atualizado);
      return atualizado;
    }
    return convidado;
  });

  if (!encontrado) {
    console.log('❌ Código de convite não encontrado:', codigo);
    return res.status(404).json({ success: false, message: 'Código não encontrado' });
  }

  try {
    fs.writeFileSync(convidadosPath, JSON.stringify(novosConvidados, null, 2));
    console.log('💾 convidados.json atualizado com sucesso!');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erro ao escrever no arquivo convidados.json:', err);
    res.status(500).json({ success: false, message: 'Erro ao salvar dados' });
  }
});


app.get('/api/convidados', (req, res) => {
  const convidados = JSON.parse(fs.readFileSync(convidadosPath, 'utf8'));
  res.json(convidados);
});

app.listen(4000, () => {
  console.log('Servidor backend rodando na porta 4000');
});