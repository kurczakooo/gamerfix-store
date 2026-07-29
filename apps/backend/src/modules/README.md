Every time a new db model is added or updated, run `npx medusa db:generate $model name$` - this generates migration files, and then run `npx medusa db:migrate`, to run the migrations.
