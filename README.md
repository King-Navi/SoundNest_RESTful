<body>

  <h1>SoundNest RESTful API 🎵</h1>
  <p>API RESTful desarrollada con Node.js y Express para gestionar usuarios y autenticación en una aplicación musical. Incluye documentación Swagger, conexión a bases de datos MySQL y MongoDB, y corre sobre HTTPS.</p>

  <h2>🚀 Requisitos</h2>
  <ul>
    <li>Node.js ≥ 16</li>
    <li>MySQL (o MariaDB) y MongoDB</li>
    <li>Certificados SSL (.key y .crt) para HTTPS</li>
  </ul>

  <h2>📦 Instalación</h2>
  <ol>
    <li>Clona el repositorio:
      <pre><code>git clone https://github.com/tu-usuario/soundnestrestful.git
cd soundnestrestful</code></pre>
    </li>
    <li>Instala dependencias:
      <pre><code>npm install</code></pre>
    </li>
    <li>Crea un archivo <code>.env</code> en la raíz con los siguientes parámetros:</li>
  </ol>
  <ul class="env-list">
    <li><code>PORT</code></li>
    <li><code>JWT_SECRET</code></li>
    <li><code>TLS_KEY_PATH</code></li>
    <li><code>TLS_CRT_PATH</code></li>
    <li><code>DB_NAME</code></li>
    <li><code>DB_USER</code></li>
    <li><code>DB_PASSWORD</code></li>
    <li><code>DB_HOST</code></li>
    <li><code>DB_PORT</code></li>
    <li><code>DB_USER_DEV</code></li>
    <li><code>DB_PASS_DEV</code></li>
    <li><code>MONGODB_URI</code></li>
  </ul>
  <ol start="4">
    <li>Genera la documentación Swagger:
      <pre><code>npm run generate-docs</code></pre>
    </li>
    <li>Inicia el servidor:
      <pre><code>npm start</code></pre>
    </li>
  </ol>
  <p>El servidor estará en <a href="https://localhost:{PORT}" target="_blank">https://localhost:6969</a></p>

  <h2>📚 Documentación Swagger</h2>
  <p>Una vez en marcha, accede a la UI Swagger en:</p>
  <p><a href="https://localhost:6969/api-docs" target="_blank">https://localhost:6969/api-docs</a></p>

  <h2>📂 Rutas Principales</h2>

  <h3>🔐 Autenticación</h3>
  <h4>POST <code>/api/auth/login</code></h4>
  <p><strong>Descripción:</strong> Autenticación de usuario mediante email y contraseña.</p>
  <h5>Body (JSON)</h5>
  <pre><code>{
  "email": "user@example.com",
  "password": "123456"
}</code></pre>
  <h5>Respuestas</h5>
  <ul>
    <li><code>200 OK</code>: Devuelve token JWT.</li>
    <li><code>401 Unauthorized</code>: Credenciales inválidas.</li>
  </ul>

  <h3>👤 Usuarios</h3>
  <h4>POST <code>/api/user/newUser</code></h4>
  <p><strong>Descripción:</strong> Crea un nuevo usuario.</p>
  <h5>Body (JSON)</h5>
  <pre><code>{
  "nameUser": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseñaSegura123",
  "additionalInformation": {
    "bio": "Me encanta la música electrónica",
    "instagram": "@juan_music",
    "genres": ["rock", "electrónica"]
  }
}</code></pre>
  <h5>Respuestas</h5>
  <ul>
    <li><code>201 Created</code>: Usuario creado correctamente.</li>
    <li><code>400 Bad Request</code>: Datos inválidos o faltantes.</li>
    <li><code>500 Internal Server Error</code>: Error en el servidor.</li>
  </ul>

  <h2>🧪 Scripts Disponibles</h2>
  <ul>
    <li><code>npm start</code> – Inicia el servidor</li>
    <li><code>npm test</code> – Ejecuta tests con Jest</li>
    <li><code>npm run generate-docs</code> – Genera documentación Swagger</li>
    <li><code>npm run generate-models</code> – Auto-genera modelos Sequelize desde la BD</li>
  </ul>

  <h2>🛡️ Seguridad</h2>
  <p>El proyecto corre sobre HTTPS. Asegúrate de tener los certificados en la carpeta <code>.certs</code> y las rutas correctas en <code>.env</code>.</p>

  <h2>🛠️ Tecnologías Usadas</h2>
  <ul>
    <li>Node.js</li>
    <li>Express</li>
    <li>Sequelize / MySQL</li>
    <li>Mongoose / MongoDB</li>
    <li>JWT</li>
    <li>Swagger (swagger-autogen, swagger-jsdoc, swagger-ui-express)</li>
    <li>dotenv</li>
  </ul>

  <p>Proyecto académico de DSR</p>

</body>
</html>
