﻿#pragma checksum "..\..\..\FelvitelAblak.xaml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4B1413A693CFF1AA0AF8C727B9E97F06DA9592BC"
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using IngatlanKarbantartoWPF;
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Controls.Ribbon;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Media.Media3D;
using System.Windows.Media.TextFormatting;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Shell;


namespace IngatlanKarbantartoWPF {
    
    
    /// <summary>
    /// FelvitelAblak
    /// </summary>
    public partial class FelvitelAblak : System.Windows.Window, System.Windows.Markup.IComponentConnector {
        
        
        #line 26 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox TulajdonosIdTextBox;
        
        #line default
        #line hidden
        
        
        #line 29 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox CimTextBox;
        
        #line default
        #line hidden
        
        
        #line 32 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox LeirasTextBox;
        
        #line default
        #line hidden
        
        
        #line 35 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox HelyszinTextBox;
        
        #line default
        #line hidden
        
        
        #line 38 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox ArTextBox;
        
        #line default
        #line hidden
        
        
        #line 41 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox MeretTextBox;
        
        #line default
        #line hidden
        
        
        #line 44 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox SzolgaltatasokTextBox;
        
        #line default
        #line hidden
        
        
        #line 47 "..\..\..\FelvitelAblak.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBox SzobaTextBox;
        
        #line default
        #line hidden
        
        private bool _contentLoaded;
        
        /// <summary>
        /// InitializeComponent
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "8.0.1.0")]
        public void InitializeComponent() {
            if (_contentLoaded) {
                return;
            }
            _contentLoaded = true;
            System.Uri resourceLocater = new System.Uri("/IngatlanKarbantartoWPF;component/felvitelablak.xaml", System.UriKind.Relative);
            
            #line 1 "..\..\..\FelvitelAblak.xaml"
            System.Windows.Application.LoadComponent(this, resourceLocater);
            
            #line default
            #line hidden
        }
        
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "8.0.1.0")]
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Design", "CA1033:InterfaceMethodsShouldBeCallableByChildTypes")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1800:DoNotCastUnnecessarily")]
        void System.Windows.Markup.IComponentConnector.Connect(int connectionId, object target) {
            switch (connectionId)
            {
            case 1:
            this.TulajdonosIdTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 2:
            this.CimTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 3:
            this.LeirasTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 4:
            this.HelyszinTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 5:
            this.ArTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 6:
            this.MeretTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 7:
            this.SzolgaltatasokTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 8:
            this.SzobaTextBox = ((System.Windows.Controls.TextBox)(target));
            return;
            case 9:
            
            #line 49 "..\..\..\FelvitelAblak.xaml"
            ((System.Windows.Controls.Button)(target)).Click += new System.Windows.RoutedEventHandler(this.Submit_Click);
            
            #line default
            #line hidden
            return;
            }
            this._contentLoaded = true;
        }
    }
}

