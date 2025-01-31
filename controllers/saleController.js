const Sale=require('../models/sale');
const Pizza=require('../models/Pizza');
const Side=require('../models/sides');


// Créer une vente avec uniquement une pizza
const createSale = async (req, res) => {
  try {
    const { pizzaId, quantitypizza, userId } = req.body;

    // Valider les données d'entrée
    if (!pizzaId || !quantitypizza || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Vérifier que la pizza existe
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    // Calculer le prix total pour la pizza
    const totalPrice = pizza.price * quantitypizza;

    // Créer la vente
    const sale = new Sale({
      pizzaId,
      quantitypizza,
      userId,
      totalPrice: totalPrice, // Total initial avec uniquement la pizza
      sides: [], // Les sides seront ajoutés plus tard
    });

    // Sauvegarder la vente
    await sale.save();
    res.status(201).json({ message: 'Sale created successfully', sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const addMultipleSides = async (req, res) => {
  try {
    const { saleId, sidesToAdd, totalprice } = req.body;

    // Vérifier que la vente existe
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Ajouter les sides à la vente
    sidesToAdd.forEach((side) => {
      sale.sides.push({
        sideId: side.sideId,
        quantity: side.quantity,
      });
    });

    // Mettre à jour le prix total fourni par le frontend
    if (totalprice !== undefined) {
      sale.totalprice = totalprice;
    }

    // Enregistrer les modifications
    await sale.save();
    res.status(200).json({ message: 'Sides added successfully', sale });
  } catch (error) {
    console.error('Error adding sides:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


const updateSale = async (req, res) => {
  try {
    const { saleId, pizzaUpdate, sidesUpdate, totalprice } = req.body;

    // Vérifier que la vente existe
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Mettre à jour ou changer la pizza
    if (pizzaUpdate) {
      const { pizzaId, quantitypizza } = pizzaUpdate;

      if (pizzaId) {
        // Vérifier si une nouvelle pizza est spécifiée
        const newPizza = await Pizza.findById(pizzaId);
        if (!newPizza) {
          return res.status(404).json({ message: 'Pizza not found' });
        }
        sale.pizzaId = pizzaId; // Remplacer l'ancienne pizza par la nouvelle
      }

      if (quantitypizza) {
        sale.quantitypizza = quantitypizza; // Mettre à jour la quantité
      }
    }

    // Mettre à jour les sides si demandé
    if (sidesUpdate && sidesUpdate.length > 0) {
      sale.sides = sidesUpdate.map(({ sideId, quantity }) => ({
        sideId,
        quantity,
      }));
    }

    // Mettre à jour le totalprice envoyé par le frontend
    if (totalprice !== undefined) {
      sale.totalprice = totalprice;
    }

    // Enregistrer les modifications
    await sale.save();
    res.status(200).json({ message: 'Sale updated successfully', sale });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Obtenir les détails d'une vente par ID
const getSaleById = async (req, res) => {
  try {
    const { saleId } = req.params;

    // Trouver la vente par ID
    const sale = await Sale.findById(saleId).populate('pizzaId').populate('sides.sideId');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({ sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Supprimer une vente
const deleteSale = async (req, res) => {
  try {
    const { saleId } = req.params;

    // Supprimer la vente par ID
    const sale = await Sale.findByIdAndDelete(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
const getAllSales = async (req, res) => {
  try {
    // Récupérer toutes les ventes avec les relations (pizzaId et sides.sideId)
    const sales = await Sale.find({})
      .populate('pizzaId') // Remplir les informations de la pizza
      .populate('sides.sideId'); // Remplir les informations des sides

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: 'No sales found' });
    }

    res.status(200).json({ sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


module.exports = {
  createSale,
  addMultipleSides,
  updateSale,
  getSaleById,
  deleteSale,
  getAllSales
};
