document.querySelector('.add-dish-form form').addEventListener('submit', function(event) {
    event.preventDefault(); // Отменяем стандартную отправку формы

    const dishName = document.getElementById('dishName').value;
    const calories = document.getElementById('calories').value;
    const proteins = document.getElementById('proteins').value;
    const fats = document.getElementById('fats').value;
    const carbs = document.getElementById('carbs').value;

    // Отправляем данные на сервер через AJAX-запрос
    fetch('/addDish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dishName: dishName,
            calories: calories,
            proteins: proteins,
            fats: fats,
            carbs: carbs
        })
    }).then(response => response.json())
      .then(data => {
          alert(`Блюдо "${data.dishName}" добавлено!`);
          location.reload(); // Перезагружаем страницу после успешного добавления
      })
      .catch(error => {
          console.error('Error:', error);
      });
});
app.post('/addDish', verifyToken, async (req, res) => {
    const { dishName, calories, proteins, fats, carbs } = req.body;

    try {
        // Сохраняем блюдо в базу данных
        const newDish = new Dish({
            userId: req.user.id,
            dishName: dishName,
            calories: calories,
            proteins: proteins,
            fats: fats,
            carbs: carbs
        });
        await newDish.save();

        res.status(200).json(newDish);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при добавлении блюда' });
    }
});
app.get('/schoolMeals', verifyToken, async (req, res) => {
    try {
        // Получаем данные о школьных блюдах и их КБЖУ
        const schoolMeals = await SchoolMeal.find({ date: todayDate }); // Предположим, что сегодня дата todayDate

        res.status(200).json(schoolMeals);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при получении данных о школьных блюдах' });
    }
});
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolMealSchema = new Schema({
    date: Date,
    dishes: [
        {
            name: String,
            calories: Number,
            proteins: Number,
            fats: Number,
            carbs: Number
        }
    ]
});

const SchoolMeal = mongoose.model('SchoolMeal', SchoolMealSchema);
module.exports = SchoolMeal;
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const dishName = document.getElementById('dishName').value;

    fetch(`/api/search?dish=${encodeURIComponent(dishName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const resultsContainer = document.getElementById('resultsContainer');
            resultsContainer.innerHTML = '';

            data.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                resultItem.innerHTML = `
                    <strong>Название блюда:</strong> ${item.name}<br>
                    <strong>Калории:</strong> ${item.calories}<br>
                    <strong>Белки:</strong> ${item.protein}g<br>
                    <strong>Жиры:</strong> ${item.fat}g<br>
                    <strong>Углеводы:</strong> ${item.carbohydrates}g
                `;

                resultsContainer.appendChild(resultItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при поиске КБЖУ. Попробуйте снова.');
        });
});
```

#### Серверная часть (Node.js):

```javascript
const express = require('express');
const axios = require('axios');
const app = express();
