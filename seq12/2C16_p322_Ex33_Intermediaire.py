#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ===================================================================
# 2C16 Exercice 33 page 322                             INTERMEDIAIRE
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
plt.xlabel('.........')              # Légende axe I
plt.ylabel('.........')              # Légende axe U
plt.axis([min(I),max(I),min(U),max(U)])# Minimum et maximum des axes
plt.plot(..., ... , ... ,ms= ... ,label='..........')# Trace le nuage
                    # de points '+' rouge taille 10, nommé U=f(I) exp

# Modélisation de la caractéristique par une fonction linéaire

# Modélisation du nuage de points par une droite d'équation U = a*I+b
# Calcule les valeurs de a et b grâce à la fonction np.polyfit(I,U,1)
# et les range dans cet ordre dans un tableau nommé Modèle
....... = np.polyfit(I,U,1)
# Affecte les valeurs rangées dans Modele aux variables a et b
...,... = Modele[...],Modele[...]     

# D'après une étude statistique préalable des incertitudes de mesure,
# l'approximation linéaire U_mod=a*I de la modélisation est possible
# si la valeur absolue de b est inférieure à 0.04 V:
if abs(b)< ... :
    U_mod = [a*i for i in ...]  # Calcule les ordonnées de U_mod =a*I
    plt.plot(...,...,...,label='.........')        # Trace U_mod=f(I)
                         # points bleus reliés, nommé U=f(I) modélisé   
    # Affiche le texte:
    # 'Modélisation de la caractéristique de la résistance'
    print('.....................................')
    # Affiche l'équation U=f(I) de la droite modélisant la
    # caractéristique en arrondissant la valeur de a à 4 décimales
    # et en précisant les unités de U et de I
    print('......... =',round(a,...),'x .........') 
else: # sinon
    # Affiche le texte : Le dipole ne semble pas être une résistance...
    .....('.....................................')

...................                # Affiche une grille
...................                # Affiche la légende
...................                # Affiche la figure
