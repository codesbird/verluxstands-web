const fs = require('fs')
const path = require('path')

function loadEnv(file) {
  const env = {}
  const content = fs.readFileSync(file, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    let val = trimmed.slice(eq + 1)
    // remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

async function main() {
  const repoRoot = path.join(__dirname, '..')
  const envFile = path.join(repoRoot, '.env.local')
  if (!fs.existsSync(envFile)) {
    console.error('.env.local not found')
    process.exit(1)
  }

  const env = loadEnv(envFile)
  // normalize private key newlines
  if (env.FIREBASE_PRIVATE_KEY) {
    env.FIREBASE_PRIVATE_KEY = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }

  // set into process.env
  for (const k of Object.keys(env)) process.env[k] = env[k]

  const admin = require('firebase-admin')
  try {
    const credential = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }

    admin.initializeApp({
      credential: admin.credential.cert(credential),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })

    const db = admin.database()

    async function checkPath(p) {
      const ref = db.ref(p)
      const snap = await ref.get()
      if (!snap.exists()) {
        console.log(`${p}: MISSING`)
        return { path: p, exists: false }
      }
      const val = snap.val()
      const keys = Object.keys(val || {})
      console.log(`${p}: exists, ${keys.length} keys`)    
      const sample = keys.slice(0, 10)
      console.log('  sample keys:', sample.join(', '))
      return { path: p, exists: true, count: keys.length, sample }
    }

    const results = {}
    results.seo = await checkPath('seo_pages')
    results.pages = await checkPath('page_builder')
    results.admins = await checkPath('admins')

    console.log('\nFull results JSON:\n')
    console.log(JSON.stringify(results, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('Error initializing admin SDK or reading DB:', err)
    process.exit(2)
  }
}

main()
