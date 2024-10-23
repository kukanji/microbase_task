# ベースイメージとしてNode.jsを使用
FROM node:latest

# 作業ディレクトリを作成
WORKDIR /workspace

# package.json と package-lock.json を作業ディレクトリにコピー
COPY package*.json /workspace/

# 依存関係をインストール
RUN npm install

# 残りのアプリケーションのコードをコピー
COPY . /workspace/

# # TypeScriptをビルド
# RUN npm run build

# # アプリケーションを起動
# CMD ["npm", "start"]
