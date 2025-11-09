# 🌐 Portafolio Digital - Proyecto Final

![Portafolio Preview](https://i.ibb.co/6Jbmkq1X/gurrutia15-github-io-proyecto-final-portafolio.png)

Un portafolio **editable desde la web** que muestra mis proyectos como desarrollador frontend.  
Totalmente funcional, con autenticación de administrador y gestión dinámica de contenido.

🔗 **[Ver demo en vivo](https://gurrutia15.github.io/proyecto-final-portafolio/)**

---

## 📌 Descripción

Este portafolio permite:

- Mostrar proyectos con **título, imagen, descripción y enlace al repositorio**.
- **Editar el contenido directamente desde la web** al iniciar sesión (solo para el administrador).
- Usar una interfaz **limpia, responsiva y profesional**, basada en los ejemplos oficiales de Bootstrap 5.

Ideal para presentar tu trabajo de forma actualizable sin necesidad de tocar código.

---

## 🛠 Tecnologías utilizadas

- **Frontend**: Vue 3, Vite, Vue Router  
- **Estilos**: Bootstrap 5 (vía CDN, sin SASS)  
- **Autenticación y Base de Datos**: Firebase Authentication + Firestore  
- **Hosting**: GitHub Pages  

---

## 🚀 Instalación y uso

### ▶️ Para ver el sitio (público)
Visita:  
👉 [https://gurrutia15.github.io/proyecto-final-portafolio/](https://gurrutia15.github.io/proyecto-final-portafolio/)

### 🖥 Para ejecutar localmente
```bash
git clone https://github.com/gurrutia15/proyecto-final-portafolio.git
cd proyecto-final-portafolio
npm install
npm run dev
```
### 🔐 Para editar proyectos (solo administrador)
1. Inicia sesión con tus credenciales de Firebase.
2. Haz clic en tu email en la navbar → **Admin**.
3. Agrega, edita o elimina proyectos desde la interfaz gráfica.

💡 Los cambios se guardan directamente en Firestore y se reflejan al instante.

## Credenciales de prueba

- Email: admin@admin.com
- Contraseña: admin123

## Enlace de acceso
👉 https://gurrutia15.github.io/proyecto-final-portafolio/