We need to create an API based on the functionality provided below - 

create a shopping website with the following features: 

1) A page that displays the 5 or more products (images and descriptions) that may 
be purchased in various quantities. This, and/or an optional product details page, 
should allow the user to select a quantity for purchase. 

2) A shopping cart page that shows the selected items and quantities of each user. 
This page should optionally allow the user to change quantities or remove items 
from the cart. This page should also allow the user to finalize their purchase. 

3) An account creation/editing page where the user can create a new account or 
modify current details. This page should at least collect/update the user's 
shipping address. Other optional behavior could include password change. Optionally, 
account creation should be at the discretion of the user, so they may purchase anonymously. 

4) A comments page where purchasers with accounts may rate and comment on products they 
have purchased with their account information. They may optionally upload photos as 
well as enter comment text. This page should also display comments from others to the 
current user before and after the purchase. 5) A login element on every page that shows 
the user a login dialog for switching from anonymous shopping. The element should 
optionally switch to showing the user's name when logged in. 


For this we also need database tables or entities which are listed below but not limited  to -

• Product (description, image, pricing, shipping cost) 
• User (email, password, username, purchase history, shipping address) 
• Comments (product, user, rating, image(s), text) 
• Cart (products, quantities, user) 