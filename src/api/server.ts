import express from 'npm:express@4.18.2';
import cors from 'npm:cors@2.8.5';

interface Lab {
    id: string;
    title: string;
    category: string;
    difficulty: 'principiante' | 'avanzado' | 'experto';
    description: string;
    downloadUrl: string;
    writeup?: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const labs: Lab[] = [
    {
        id: 'xss-basic',
        title: 'XSS Básico',
        category: 'xss',
        difficulty: 'principiante',
        description: 'Laboratorio básico de Cross-Site Scripting con vulnerabilidades reflejadas.',
        downloadUrl: '/downloads/xss-basic.ova',
        writeup: 'Guía detallada de explotación XSS básico'
    },
    {
        id: 'sqli-blind',
        title: 'SQL Injection Blind',
        category: 'sqli',
        difficulty: 'avanzado',
        description: 'Laboratorio avanzado de SQL Injection con técnicas blind.',
        downloadUrl: '/downloads/sqli-blind.ova',
        writeup: 'Tutorial de explotación SQLi blind'
    }
];

app.get('/api/labs', (req, res) => {
    res.json(labs);
});

app.get('/api/labs/:category', (req, res) => {
    const categoryLabs = labs.filter(lab => lab.category === req.params.category);
    res.json(categoryLabs);
});

app.get('/api/labs/:category/:difficulty', (req, res) => {
    const filteredLabs = labs.filter(
        lab => lab.category === req.params.category && 
        lab.difficulty === req.params.difficulty
    );
    res.json(filteredLabs);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});