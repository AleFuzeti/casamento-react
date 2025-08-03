// scripts/migrateToFirebase.js
// Script para migrar os dados de convidados para o Firebase

const fs = require('fs');
const path = require('path');

// Este script deve ser executado DEPOIS de configurar o Firebase
// Para usar: node scripts/migrateToFirebase.js

const convidadosPath = path.join(__dirname, '../public/static/convidados.json');

try {
  const convidados = JSON.parse(fs.readFileSync(convidadosPath, 'utf8'));
  
  console.log('📊 Dados para migrar:');
  console.log(`Total de convidados: ${convidados.length}`);
  
  const confirmados = convidados.filter(c => c.confirmado);
  console.log(`Já confirmaram: ${confirmados.length}`);
  
  console.log('\n🔥 Para migrar para o Firebase:');
  console.log('1. Configure o Firebase no arquivo src/firebase/config.js');
  console.log('2. Execute a aplicação e use o código M0M0 para ver o painel');
  console.log('3. Ou copie os dados manualmente no Firebase Console');
  
  console.log('\n📋 Dados prontos para Firebase:');
  console.log(JSON.stringify(convidados, null, 2));
  
} catch (error) {
  console.error('❌ Erro ao ler arquivo de convidados:', error);
}
