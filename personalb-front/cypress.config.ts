import { defineConfig } from 'cypress'
import eyesPlugin from '@applitools/eyes-cypress'

// export default defineConfig({
//   e2e: {
//     'baseUrl': 'http://localhost:4200'
//   },

//   component: {
//     devServer: {
//       framework: 'angular',
//       bundler: 'webpack',
//     },
//     specPattern: '**/*.cy.ts'
//   }

// })


export default eyesPlugin(defineConfig({
  e2e: {
    'baseUrl': 'http://localhost:4200'
  },


  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }
}))
