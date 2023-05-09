import AdminJS, { AdminJSOptions } from 'adminjs'
import express from 'express'
import { componentLoader } from './componentLoader.js'
import { leafletSingleMarkerMapFeature } from '@adminjs/leaflet'
import { Site } from './models/site.js'
import { MikroORM, Options } from '@mikro-orm/core'
import * as AdminJSMikroORM from '@adminjs/mikroorm'
import AdminJSExpress from '@adminjs/express'


const PORT = 3000

AdminJS.registerAdapter({
  Resource: AdminJSMikroORM.Resource,
  Database: AdminJSMikroORM.Database,
})

// mysql> create table site(id bigint auto_increment primary key, name varchar(255), latitude float, longitude float);
const config: Options = {
  entities: [Site],
  type: 'mysql',
  clientUrl: 'mysql://root:password@127.0.0.1:3306/adminjs',
}

const start = async () => {
  const orm = await MikroORM.init(config)
  const adminOptions: AdminJSOptions = {
    componentLoader,
    resources: [
      {
        resource: { model: Site, orm },
        options: {
          id: "Site",
          features: [
            leafletSingleMarkerMapFeature({
              componentLoader,
              paths: {
                mapProperty: 'location',
                latitudeProperty: 'latitude',
                longitudeProperty: 'longitude',
              },
              mapProps: {
                center: [50, 10],
                zoom: 4,
              }
            })
          ]
        }
      }
    ],
    assets: {
      styles: ['/leaflet.css']
    },
  }
  const app = express()

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)
  app.use(express.static("./node_modules/leaflet/dist"))

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}


start()
