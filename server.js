import express from "express";
import { fileURLToPath } from "node:url";

const app = express();
app.set("view engine", "ejs");
app.set("views", fileURLToPath(new URL("./views/", import.meta.url)));
app.use(express.json());

const citations = [
    { id: 1, texte: "Apprendre en pratiquant.", auteur: "Équipe du TP" },
];
let prochainId = 2;

app.get("/", (req, res) => {
    res.render("index", { citations });
});

app.get("/ping", (req, res) => {
    res.type("text/plain").send("Serveur de citations prêt.");
});

app.get("/citations", (req, res) => {
    res.json(citations);
});

app.get("/citations/:id", (req, res) => {
    const idRecherche = Number(req.params.id);
    const task = citations.find((t) => t.id === idRecherche);
    if (!task) {
        return res.status(404).json({ error: "Citation introuvable" });
    }
    res.status(200).json(task);
});

app.post("/citations", (req, res) => {
    if (req.body.texte.trim() === "" || req.body.auteur.trim() === "") {
        return res.status(400).send("Champs invalides");
    }
    const tab = {};
    tab.id = prochainId;
    tab.texte = req.body.texte;
    tab.auteur = req.body.auteur;
    citations.push(tab);
    prochainId++;
    res.status(201).json(tab);
});

app.put("/citations/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = citations.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).send("Citation introuvable");
    }
    if (req.body.texte.trim() === "" || req.body.auteur.trim() === "") {
        return res.status(400).send("Champs invalides");
    }
    const updatedProduct = {
        id: citations[index].id,
        texte: req.body.texte,
        auteur: req.body.auteur,
    };
    citations[index] = updatedProduct;
    res.status(200).json(updatedProduct);
});

app.delete("/citations/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = citations.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).send("Citation introuvalble");
    }
    citations.splice(index, 1);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log("API disponible sur http://localhost:3000");
});
