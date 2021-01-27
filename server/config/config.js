

// =====================================================
// Puerto
// =====================================================
process.env.PORT = process.env.PORT || 3000;

// =====================================================
// Entorno (Produccion o desarrollo)
// =====================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================================================
// Base de datos
// =====================================================

let urlDB;

if(process.env.NODE_ENV === 'dev') 
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = 'mongodb+srv://bguillenn:jHvA8Mc1qbyy9UcE@cluster0.1a38k.mongodb.net/cafe';

process.env.URLDB = urlDB;
