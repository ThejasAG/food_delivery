import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="glass sticky-top" style={{ height: 'var(--nav-height)', zIndex: 1000 }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: 'var(--primary)' }}>
          <UtensilsCrossed size={28} />
          <span>FoodDash</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Link to="/" style={{ fontWeight: 500 }}>Browse</Link>
          
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-10px', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                fontSize: '10px', 
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '50px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/restaurants" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>Restaurants</Link>
                  <Link to="/admin/menus" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>Menus</Link>
                  <Link to="/admin/orders" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>Admin Orders</Link>
                  <Link to="/admin/settings" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>Settings</Link>
                </>
              )}
              <Link to="/orders" title="My Orders"><UserIcon size={22} /></Link>
              <button 
                onClick={logout} 
                style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px' }}>Login</Link>
          )}
        </div>
      </div>
      
      <style>{`
        .sticky-top {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
