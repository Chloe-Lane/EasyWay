# EasyStay

## Description
EasyStay is a real estate platform, allowing users to list, book, and manage short-term rental properties. The platform provides an easy-to-use interface for both hosts and guests to interact seamlessly.

## Features
- User authentication (Free and Premium users)
- Property listings with images and details
- Booking system for short-term rentals
- Subscription-based premium features
- Responsive design for mobile and desktop users

## Installation
### Prerequisites
- Python & Django (for backend)
- Node.js & React (for frontend)
- PostgreSQL or another supported database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Chloe-Lane/easystay.git
   cd easystay
   ```
2. Set up the backend:
   ```bash
   cd backend
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```
3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

## Usage
1. Register or log in as a user.
2. Browse or list rental properties.
3. Book stays with available listings.
4. Upgrade to premium for enhanced features.

## Contributing
Feel free to fork the repo, make changes, and submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or support, reach out to the project maintainers.
