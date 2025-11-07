import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FoodItem, MealSelection, View, User } from './types';
import Header from './components/Header';
import Menu from './components/Menu';
import MySelection from './components/MySelection';
import AdminView from './components/AdminView';
import ChefSpecial from './components/ChefSpecial';
import Login from './components/Login';
import SmsToast from './components/SmsToast';


const initialMenuItems: FoodItem[] = [
   {
    id: 9,
    name: 'Oatmeal with Berries',
    description: 'Warm and hearty oatmeal topped with fresh seasonal berries and a drizzle of honey.',
    price: 5.00,
    category: 'Breakfast',
  },
  {
    id: 10,
    name: 'Scrambled Tofu',
    description: 'A savory and protein-rich vegan alternative to scrambled eggs, with turmeric and black salt.',
    price: 6.50,
    category: 'Breakfast',
  },
  {
    id: 1,
    name: 'Veggie Burger',
    description: 'A delicious plant-based patty with fresh lettuce, tomato, and vegan mayo.',
    price: 8.00,
    category: 'Lunch',
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Simple and delicious with fresh mozzarella, tomatoes, and basil.',
    price: 12.00,
    category: 'Lunch',
  },
  {
    id: 3,
    name: 'Greek Salad',
    description: 'Crisp lettuce, cucumbers, tomatoes, olives, and feta cheese with a lemon vinaigrette.',
    price: 9.50,
    category: 'Lunch',
  },
   {
    id: 8,
    name: 'Vegetable Stir-fry',
    description: 'A healthy mix of fresh vegetables stir-fried in a savory sauce.',
    price: 10.50,
    category: 'Lunch',
  },
  {
    id: 4,
    name: 'French Fries',
    description: 'Golden, crispy, and perfectly salted. The ideal side or snack.',
    price: 3.50,
    category: 'Evening Snack',
  },
  {
    id: 5,
    name: 'Onion Rings',
    description: 'Battered and fried to perfection, served with a tangy dip.',
    price: 4.25,
    category: 'Evening Snack',
  },
    {
    id: 6,
    name: 'Iced Coffee',
    description: 'Chilled and refreshing, a perfect pick-me-up.',
    price: 3.00,
    category: 'Beverage',
  },
  {
    id: 7,
    name: 'Fresh Orange Juice',
    description: '100% freshly squeezed orange juice, full of vitamins.',
    price: 4.00,
    category: 'Beverage',
  },
];

const dummyUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  name: `Employee ${i + 1}`,
  email: `employee${i+1}@example.com`,
  photoUrl: `https://i.pravatar.cc/150?u=employee${i+1}@example.com`,
  isAdmin: false,
  phoneNumber: `555-555-${5500 + i}`,
}));

// Dummy data for selections to showcase the admin view
const createDummySelections = (users: User[], menu: FoodItem[], date: Date): MealSelection[] => {
  const selections: MealSelection[] = [];
  users.forEach(user => {
    // 20% chance to opt-out
    if (Math.random() < 0.2) {
        selections.push({ user, items: [], date, optedOut: true });
        return;
    }

    const mainCourse = menu.find(item => item.category === 'Lunch' && Math.random() > 0.5);
    const snack = menu.find(item => item.category === 'Evening Snack' && Math.random() > 0.6);
    const beverage = menu.find(item => item.category === 'Beverage' && Math.random() > 0.7);
    const items = [mainCourse, snack, beverage].filter((item): item is FoodItem => !!item);
    
    if (items.length > 0) {
      selections.push({
        user,
        items,
        date,
      });
    }
  });
  return selections;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSelection, setCurrentSelection] = useState<FoodItem[]>([]);
  const [allSelections, setAllSelections] = useState<MealSelection[]>([]);
  const [historicalSelections, setHistoricalSelections] = useState<MealSelection[]>([]);
  const [view, setView] = useState<View>('customer');
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [isAfterCutoff, setIsAfterCutoff] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [menuItems, setMenuItems] = useState<FoodItem[]>(initialMenuItems);
  const [toast, setToast] = useState<string | null>(null);

  const showSmsToast = (phoneNumber: string, message: string) => {
    const formattedMessage = `To: ${phoneNumber}\n\n${message}`;
    setToast(formattedMessage);
  };

  // Effect to generate dummy data for today and for history on initial load
  useEffect(() => {
    const today = new Date();
    setAllSelections(createDummySelections(dummyUsers, initialMenuItems, today));

    // Generate historical data for the last 30 days
    const history: MealSelection[] = [];
    for (let i = 1; i <= 30; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        history.push(...createDummySelections(dummyUsers, initialMenuItems, pastDate));
    }
    setHistoricalSelections(history);
  }, []);

  useEffect(() => {
    const checkCutoff = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(21, 0, 0, 0); // 9:00 PM
      setIsAfterCutoff(now > cutoff);
    };

    checkCutoff();
    const intervalId = setInterval(checkCutoff, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  // Effect to request notification permission upon employee login
  useEffect(() => {
    if (user && !user.isAdmin) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, [user]);

  // Effect to send a reminder notification if needed
  useEffect(() => {
    let reminderTimeout: number;

    // Conditions for sending a reminder:
    // 1. User is an employee
    // 2. They have not confirmed their meal
    // 3. It's before the cutoff time
    // 4. Notification permission is granted
    if (user && !user.isAdmin && !userConfirmed && !isAfterCutoff && notificationPermission === 'granted') {
      // For demo purposes, send a reminder 5 seconds after login.
      // In a real application, this logic would be tied to a specific time (e.g., 8 PM).
      reminderTimeout = window.setTimeout(() => {
        const reminderMessage = "Just a friendly reminder to confirm your meal selection for tomorrow before the 9:00 PM deadline!";
        new Notification("Karmic Canteen Reminder", {
          body: reminderMessage,
          icon: '/vite.svg'
        });
        if (user.phoneNumber) {
            showSmsToast(user.phoneNumber, reminderMessage);
        }
      }, 5000);
    }

    // Cleanup: clear the timeout if the user confirms their selection or logs out
    return () => {
      if (reminderTimeout) {
        clearTimeout(reminderTimeout);
      }
    };
  }, [user, userConfirmed, isAfterCutoff, notificationPermission]);

  const handleLogin = useCallback((isAdmin: boolean, email?: string, phoneNumber?: string) => {
    if (isAdmin) {
      setUser({
        name: 'Canteen Admin',
        email: 'admin@example.com',
        photoUrl: `https://i.pravatar.cc/150?u=admin@example.com`,
        isAdmin: true,
      });
    } else if (email && phoneNumber) {
       // Create a user name from the email address
      const name = email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
        
      setUser({
        name,
        email,
        photoUrl: `https://i.pravatar.cc/150?u=${email}`,
        isAdmin: false,
        phoneNumber,
      });
    }
    setUserConfirmed(false);
    setCurrentSelection([]);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setView('customer');
    setUserConfirmed(false);
  }, []);

  const handleSelectItem = useCallback((itemToAdd: FoodItem) => {
    if (userConfirmed || isAfterCutoff) return; // Don't allow changes after confirmation or cutoff

    setCurrentSelection((prev) => {
      // If the new item is a main course, replace any existing main course
      if (itemToAdd.category === 'Lunch') {
        const otherItems = prev.filter(item => item.category !== 'Lunch');
        return [...otherItems, itemToAdd];
      }
      // Otherwise, add if it's not already there
      if (!prev.find(item => item.id === itemToAdd.id)) {
        return [...prev, itemToAdd];
      }
      return prev;
    });
  }, [userConfirmed, isAfterCutoff]);

  const handleDeselectItem = useCallback((itemId: number) => {
    if (userConfirmed || isAfterCutoff) return;
    setCurrentSelection((prev) => prev.filter(item => item.id !== itemId));
  }, [userConfirmed, isAfterCutoff]);


  const handleConfirmSelection = useCallback(() => {
    if (!user || currentSelection.length === 0 || isAfterCutoff) return;
    
    const newSelection: MealSelection = {
      user,
      items: currentSelection,
      date: new Date(),
    };
    
    // Replace previous selection for the same user
    setAllSelections((prev) => {
        const otherSelections = prev.filter(s => s.user.email !== user.email);
        return [...otherSelections, newSelection];
    });
    setUserConfirmed(true);
    
    const confirmationMessage = "We've received your meal selection. You can still modify it before 9:00 PM.";
    // Browser Notification
    if (notificationPermission === 'granted') {
      new Notification("Your Order is Confirmed!", {
        body: confirmationMessage,
        icon: '/vite.svg'
      });
    } else {
      alert('Your meal selection for tomorrow has been confirmed!');
    }
    
    // SMS Notification
    if(user.phoneNumber) {
        showSmsToast(user.phoneNumber, confirmationMessage);
    }

  }, [user, currentSelection, isAfterCutoff, notificationPermission]);

  const handleOptOut = useCallback(() => {
    if (!user || isAfterCutoff) return;
    const confirmation = window.confirm("Are you sure you want to opt out of tomorrow's meal?");
    if (confirmation) {
      const newSelection: MealSelection = {
        user,
        items: [],
        date: new Date(),
        optedOut: true,
      };
      // Replace previous selection for the same user
      setAllSelections((prev) => {
        const otherSelections = prev.filter(s => s.user.email !== user.email);
        return [...otherSelections, newSelection];
      });
      setUserConfirmed(true);
      setCurrentSelection([]);

      const optOutMessage = "Your choice to opt out for tomorrow's meal has been saved.";
      if (notificationPermission === 'granted') {
        new Notification("You have opted out", {
          body: optOutMessage,
          icon: '/vite.svg'
        });
      } else {
        alert("You have successfully opted out for tomorrow's meal.");
      }
      
      // SMS Notification
      if (user.phoneNumber) {
        showSmsToast(user.phoneNumber, optOutMessage);
      }
    }
  }, [user, isAfterCutoff, notificationPermission]);

  const handleModifySelection = useCallback(() => {
    setUserConfirmed(false);
  }, []);

  // --- Menu Management Handlers ---
  const handleAddItem = (item: Omit<FoodItem, 'id' | 'price'>) => {
    setMenuItems(prev => [...prev, { ...item, id: Date.now(), price: 0 }]);
  };

  const handleUpdateItem = (updatedItem: FoodItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };
  
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header 
        user={user} 
        onLogout={handleLogout}
        currentView={view} 
        setView={setView} 
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {(view === 'customer' || !user.isAdmin) ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <ChefSpecial />
               <Menu 
                  menuItems={menuItems} 
                  onSelectItem={handleSelectItem} 
                  isAfterCutoff={isAfterCutoff}
                />
            </div>
            <div className="lg:col-span-1">
              <MySelection
                selection={currentSelection}
                onConfirm={handleConfirmSelection}
                onDeselect={handleDeselectItem}
                isConfirmed={userConfirmed}
                onOptOut={handleOptOut}
                onModify={handleModifySelection}
                isAfterCutoff={isAfterCutoff}
              />
            </div>
          </div>
        ) : (
          <AdminView 
            selections={allSelections}
            historicalSelections={historicalSelections}
            menuItems={menuItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </main>
      {toast && <SmsToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;