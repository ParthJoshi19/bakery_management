from flask import Flask, jsonify, send_from_directory, request, session
import os
import time
import hashlib

app = Flask(__name__, static_folder='static')
app.secret_key = 'supersecretkey'
SESSION_TIMEOUT = 600 


USERS = {
    'admin': {
        'password': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'admin',
        'orders': []
    },
    'staff': {
        'password': hashlib.sha256('staffpass'.encode()).hexdigest(),
        'role': 'staff',
        'orders': []
    }
}

bakery_items = [
    {"id": 1, "name": "Sourdough Bread", "price": 3.5, "stock": 10},
    {"id": 2, "name": "Croissant", "price": 2.0, "stock": 20},
    {"id": 3, "name": "Chocolate Cake", "price": 15.0, "stock": 5},
]

next_item_id = 4


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def require_login(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        user = session.get('user')
        last_active = session.get('last_active')
        if not user or not last_active or time.time() - last_active > SESSION_TIMEOUT:
            session.pop('user', None)
            session.pop('last_active', None)
            return jsonify({'success': False, 'error': 'Login required or session expired'}), 401
        session['last_active'] = time.time()
        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        user = session.get('user')
        if not user or USERS[user]['role'] != 'admin':
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'staff')
    if not username or not password or username in USERS:
        return jsonify({'success': False, 'error': 'Invalid or duplicate username'}), 400
    USERS[username] = {
        'password': hash_password(password),
        'role': role if role in ['admin', 'staff'] else 'staff',
        'orders': []
    }
    return jsonify({'success': True, 'user': username, 'role': USERS[username]['role']})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = USERS.get(username)
    if user and user['password'] == hash_password(password):
        session['user'] = username
        session['last_active'] = time.time()
        return jsonify({'success': True, 'user': username, 'role': user['role']})
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
@require_login
def logout():
    session.pop('user', None)
    session.pop('last_active', None)
    return jsonify({'success': True})

@app.route('/api/user', methods=['GET'])
def get_user():
    user = session.get('user')
    if user:
        return jsonify({'logged_in': True, 'user': user, 'role': USERS[user]['role']})
    return jsonify({'logged_in': False})


@app.route('/api/items', methods=['GET'])
@require_login
def get_items():
    return jsonify(bakery_items)

@app.route('/api/items', methods=['POST'])
@require_login
@require_admin
def add_item():
    global next_item_id
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')
    if not name or price is None or stock is None:
        return jsonify({'success': False, 'error': 'Missing fields'}), 400
    item = {"id": next_item_id, "name": name, "price": price, "stock": stock}
    bakery_items.append(item)
    next_item_id += 1
    return jsonify({'success': True, 'item': item})

@app.route('/api/items/<int:item_id>', methods=['PUT'])
@require_login
@require_admin
def edit_item(item_id):
    data = request.get_json()
    for item in bakery_items:
        if item['id'] == item_id:
            item['name'] = data.get('name', item['name'])
            item['price'] = data.get('price', item['price'])
            item['stock'] = data.get('stock', item['stock'])
            return jsonify({'success': True, 'item': item})
    return jsonify({'success': False, 'error': 'Item not found'}), 404

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
@require_login
@require_admin
def delete_item(item_id):
    global bakery_items
    bakery_items = [item for item in bakery_items if item['id'] != item_id]
    return jsonify({'success': True})

        
@app.route('/api/orders', methods=['POST'])
@require_login
def place_order():
    user = session['user']
    data = request.get_json()
    item_id = data.get('item_id')
    quantity = data.get('quantity', 1)
    for item in bakery_items:
        if item['id'] == item_id:
            if item['stock'] < quantity:
                return jsonify({'success': False, 'error': 'Insufficient stock'}), 400
            item['stock'] -= quantity
            order = {
                'item_id': item_id,
                'item_name': item['name'],
                'quantity': quantity,
                'price': item['price'],
                'total': item['price'] * quantity,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            USERS[user]['orders'].append(order)
            return jsonify({'success': True, 'order': order})
    return jsonify({'success': False, 'error': 'Item not found'}), 404

@app.route('/api/orders', methods=['GET'])
@require_login
def get_orders():
    user = session['user']
    return jsonify(USERS[user]['orders'])

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
