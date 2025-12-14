#!/bin/bash

echo "🔧 Configurando MySQL para o projeto e-commerce..."

# Comando SQL para criar database e usuário
mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS ecommerce;
CREATE USER IF NOT EXISTS 'fullstack'@'localhost' IDENTIFIED BY 'senha_fullstack';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'fullstack'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
  echo "✅ MySQL configurado com sucesso!"
  echo "   - Database: ecommerce"
  echo "   - Usuário: fullstack"
  echo "   - Senha: senha_fullstack"
else
  echo "❌ Erro ao configurar MySQL"
fi
