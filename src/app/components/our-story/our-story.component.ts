import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class OurStoryComponent {
  values = [
    {
      icon: 'fas fa-pen-nib',
      title: 'Quality First',
      description: 'We prioritize thoughtful, well-crafted writing over viral content and clickbait.'
    },
    {
      icon: 'fas fa-users',
      title: 'Community Driven',
      description: 'Our platform is shaped by and for the Tunisian writing community.'
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Fair Compensation',
      description: 'We believe in fairly compensating writers for their valuable contributions.'
    }
  ];

  writerFeatures = [
    {
      icon: 'fas fa-chart-line',
      title: 'Performance Analytics',
      description: 'Detailed insights into how your stories perform and connect with readers.'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'Writer Program',
      description: 'Earn money based on member engagement with your stories.'
    },
    {
      icon: 'fas fa-tools',
      title: 'Writing Tools',
      description: 'Advanced editing tools and formatting options to perfect your work.'
    }
  ];

  startWriting() {
    // Implement navigation to writing page
  }

  startReading() {
    // Implement navigation to reading page
  }
}
