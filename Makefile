teste: build
	npm link;cd /home/dev/merm-admin;npm link amplify-form-vue
build:
	npm run build


app_to_pckg:
	mv vite.config.pkg.ts vite.config.tmp.ts;\
	mv vite.config.ts vite.config.app.ts;\
	mv vite.config.tmp.ts vite.config.ts;\

	mv tsconfig.pkg.json tsconfig.tmp.json;\
	mv tsconfig.json tsconfig.app.json;\
	mv tsconfig.tmp.json tsconfig.json;\

pckg_to_app:
	mv vite.config.app.ts vite.config.tmp.ts;\
	mv vite.config.ts vite.config.pkg.ts;\
	mv vite.config.tmp.ts vite.config.ts;\

	mv tsconfig.app.json tsconfig.tmp.json;\
	mv tsconfig.json tsconfig.pkg.json;\
	mv tsconfig.tmp.json tsconfig.json;\