
#para instalar dependências
npm install


# Instalar MongoDB Community Edition (Mac)
brew tap mongodb/brew
brew install mongodb-community

# Iniciar o serviço do MongoDB
brew services start mongodb/brew/mongodb-community

# Verificar se está rodando
brew services list




# Acessar MySQL
mysql -u root -p

# criar usuário e criar banco de dados:
CREATE DATABASE ecommerce;
CREATE USER 'fullstack'@'localhost' IDENTIFIED BY 'senha_fullstack';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'fullstack'@'localhost';
FLUSH PRIVILEGES;
EXIT;



# Para executar o projeto
npm start

# Cores de referência:  Open Color (já uso em outros projetos meus)
https://yeun.github.io/open-color/
