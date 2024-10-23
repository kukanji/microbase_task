# ベースイメージとしてNode.jsを使用
FROM node:latest

# 作業ディレクトリを作成
WORKDIR /workspace

# 依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . /workspace/

# TypeScriptをビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "start"]
