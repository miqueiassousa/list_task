```bash

mysql -u admin -p admin





CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT,
  setor VARCHAR(100),
  descricao TEXT,
  prioridade ENUM('Baixa', 'Média', 'Alta'),
  dataCadastro DATE,
  status ENUM('A fazer', 'Fazendo', 'Pronto'),
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);
```