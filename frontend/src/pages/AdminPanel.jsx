import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [recipes, setRecipes] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', ingredients: [], instructions: '',
        calories: 0, protein: 0, carbs: 0, fat: 0, diet_tag: 'none'
    });
    const navigate = useNavigate();

    const fetchRecipes = async () => {
        try {
            const res = await api.get('/recipes');
            setRecipes(res.data);
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ingredients: formData.ingredients.split(',') };
            await api.post('/recipes', payload);
            fetchRecipes();
            alert("Recipe Added!");
        } catch (error) {
            console.error("Failed to add recipe", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/recipes/${id}`);
            fetchRecipes();
        } catch (error) {
            console.error("Failed to delete recipe", error);
        }
    };

    return (
        <div className="admin-panel">
            <header className="dashboard-header">
                <h1>Admin Panel</h1>
                <button onClick={() => navigate('/dashboard')} className="btn-logout">Back to Dashboard</button>
            </header>

            <div className="admin-grid">
                <section className="add-recipe-form">
                    <h2>Add New Recipe</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        <input type="text" placeholder="Ingredients (comma separated)" value={formData.ingredients} onChange={e => setFormData({ ...formData, ingredients: e.target.value })} required />
                        <textarea placeholder="Instructions" value={formData.instructions} onChange={e => setFormData({ ...formData, instructions: e.target.value })} required />
                        
                        <div className="form-row">
                            <input type="number" placeholder="Calories" onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })} required />
                            <input type="number" placeholder="Protein (g)" onChange={e => setFormData({ ...formData, protein: Number(e.target.value) })} required />
                            <input type="number" placeholder="Carbs (g)" onChange={e => setFormData({ ...formData, carbs: Number(e.target.value) })} required />
                            <input type="number" placeholder="Fat (g)" onChange={e => setFormData({ ...formData, fat: Number(e.target.value) })} required />
                        </div>

                        <select value={formData.diet_tag} onChange={e => setFormData({ ...formData, diet_tag: e.target.value })}>
                            <option value="none">None</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="keto">Keto</option>
                        </select>
                        
                        <button type="submit" className="btn-primary">Add Recipe</button>
                    </form>
                </section>

                <section className="recipe-list">
                    <h2>Manage Recipes</h2>
                    <ul>
                        {recipes.map(recipe => (
                            <li key={recipe.id} className="recipe-list-item">
                                <span>{recipe.title} ({recipe.diet_tag})</span>
                                <button onClick={() => handleDelete(recipe.id)} className="btn-danger">Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
