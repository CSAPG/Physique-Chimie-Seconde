#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ===================================================================
# 2C16 Exercice 33 page 322                                INITIATION 
# Programme permettant de représenter et de modéliser
# la caractéristique U=f(I) d'une résistance
# ===================================================================
import numpy as np                        
from matplotlib import pyplot as plt
    
U = [.......................................] # Valeurs de U (en V)    
I = [.......................................] # Valeurs de I (en mA)

# Figure représentant la caractéristique U=f(I) 
                
plt.figure('Etude d\'une résistance')# Initialisation de la figure
plt.title('Caractéristique U=f(I)')  # Titre du graphe
plt.xlabel('I (en mA)')              # Légende axe I
plt.ylabel('U (en V)')               # Légende axe U
plt.axis([min(I),max(I),min(U),max(U)])# Minimum et maximum des axes
plt.plot(I,U,'r+',ms=10,label='U=f(I) exp')# Trace le nuage de points
                              # '+' rouge taille 10, nommé U=f(I) exp

# Modélisation de la caractéristique par une fonction linéaire

# Modélisation du nuage de points par une droite d'équation U = a*I+b
# Calcule les valeurs de a et b grâce à la fonction np.polyfit(I,U,1)
# et les range dans cet ordre dans un tableau nommé Modèle
Modele = np.polyfit(I,U,1)
# Affecte les valeurs rangées dans Modele aux variables a et b
a,b = Modele[0],Modele[1]     

# D'après une étude statistique préalable des incertitudes de mesure,
# l'approximation linéaire U_mod=a*I de la modélisation est possible
# si la valeur absolue de b est inférieure à 0.04 V:
if abs(b)<0.04:
    U_mod = [a*i for i in I]    # Calcule les ordonnées de U_mod =a*I
    plt.plot(I,U_mod,'b-',label='U=f(I) modélisé') # Trace U_mod=f(I)
                         # points bleus reliés, nommé U=f(I) modélisé   
    # Affiche le texte:
    # 'Modélisation de la caractéristique de la résistance'
    print('Modélisation de la caractéristique de la résistance')
    # Affiche l'équation U=f(I) de la droite modélisant la
    # caractéristique en arrondissant la valeur de a à 4 décimales
    # et en précisant les unités de U et de I
    print('U(en V) =',round(a,4),'x I(en mA)') 
else: # sinon
    # Affiche le texte : Le dipole ne semble pas être une résistance...
    print('Le dipole ne semble pas être une résistance...')

plt.grid()              # Affiche une grille
plt.legend()            # Affiche la légende
plt.show()              # Affiche la figure
