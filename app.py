@app.route('/')
def index():
    return send_file('public/index.html')
