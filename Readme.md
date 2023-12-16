# Descrição

Aplicativo desenvolvido para uma empresa de compra e venda de fumos.

# Features

- Armazenamento local sem necessidade de conexão com a internet (devido a indisponibilidade na região de sinal)
- Classificação de compra por tipo de fumo
- Suporte as duas unidades de medidas de peso adotadas pelo cliente (kilogramas e arrobas)
- Relatório de vendas com cálculo de preço médio
- Disponibilidade de estoque com base nas entradas e saídas do produto
- Cálculo de preço médio pago em ambas unidades de medidas

# Tecnologias

- `Expo/React` Native no core
- `expo-router v2` para rotiamento
- `Nativewind/tailwindcss` para estilização
- `Typeorm` com `sqlite` para persistência de dados
- `react-native-pie-chart` para geração de gráficos

# Como utilizar o projeto

  <ol>
  <li>
  
  `npm install`

Para instalar as dependências

  </li>

  <li>

`npm start`

Para iniciar o projeto em modo de desenvolvimento

  </li>

  </ol>

# Como gerar a build apk

`npm build`

Necessário ter o `eas-cli` instalado no computador e devidamente configurado
