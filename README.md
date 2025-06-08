# アンビエントナビエンジニア長期インターン技術課題
## 環境構築
 - `npm i`
 - `npx auth secret`
 - envファイルに各URLを設定
```env.local
AUTH_SECRET=[npx auth secretで追加されるランダム文字列] # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_GOOGLE_ID=[GoogleAuthPlatformのクライアントID]
AUTH_GOOGLE_SECRET=[GoogleAuthPlatformのクライアントシークレット]
DATABASE_URL=[SupabasePostgresのデータベースURL]
DIRECT_URL=[SupabasePostgresのマイグレーション用ダイレクトURL]
SUPABASE_URL="https://gauvehvvywdffzavofsf.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdXZlaHZ2eXdkZmZ6YXZvZnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTQ2NjMsImV4cCI6MjA2NDUzMDY2M30.TUcWTBYw2AaCsWPnqRBfpjkYEvHeS40zWj2g6P_R74s"
```
## 技術的な工夫点
 - `Auth.js`を用いてシンプルかつセキュアに認証・認可を実装しました
 - `shadcn/ui`でUIデザイン統一とクオリティ向上を図っています
## 追加機能の説明とその選定理由
- OpenIDでのログイン
    - アカウント登録のハードルを下げてユーザーのチェックイン率を上げるため
- 「もう一度注文する」機能
    - 過去の利用時に注文したメニューを目立つ場所に表示することで顧客が好んでいる可能性の高い商品の注文を提案し、顧客単価を上げるため
## 生成AIの利用について
### 使用したAIツール (ChatGPT、Claude、GitHub Copilotなど)
 - Cline(Claude Sonnet 4)
 - Gemini 2.5 Pro
### 具体的な使用場面と目的
- モックデータの生成
- 一部のコミットメッセージやプルリクエスト本文の生成
- あまり考える余地のない実装のコーディング
### 利用したプロンプト
- @/src/libs/actions/authActions.ts 55行目の"account already exists"などのエラーメッセージを日本語にしてください
- @/src/libs/actions/authActions.ts login関数のエラーハンドリングをregister関数と同じようにエラー内容の日本語を文字列で返す仕様に変更してください
- @/src/components/orderItemCard.tsx onchangeを分離
- @/src/components/menuItemEditorCard.tsx 参考と書かれた箇所の実装を参考に、全てのinputやtextareaのonChangeにhandleStatusChangeを追加してください
- 「パフェの画像を生成してください」など画像の生成
